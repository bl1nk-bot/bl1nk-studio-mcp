use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;
use regex::Regex;
use chrono::{DateTime, Utc, TimeZone};
use reqwest::header::{HeaderMap, HeaderValue, CONTENT_TYPE, COOKIE, ORIGIN, REFERER, USER_AGENT};
use rand::Rng;

pub const BASE_URL: &str = "https://notebooklm.google.com";
pub const BATCHEXECUTE_URL: &str = "https://notebooklm.google.com/_/LabsTailwindUi/data/batchexecute";

// RPC IDs
pub const RPC_LIST_NOTEBOOKS: &str = "wXbhsf";
pub const RPC_GET_NOTEBOOK: &str = "rLM1Ne";
pub const RPC_CREATE_NOTEBOOK: &str = "CCqFvf";
pub const RPC_RENAME_NOTEBOOK: &str = "s0tc2d";
pub const RPC_DELETE_NOTEBOOK: &str = "WWINqb";
pub const RPC_ADD_SOURCE: &str = "izAoDd";
pub const RPC_GET_SOURCE: &str = "hizoJc";
pub const RPC_CHECK_FRESHNESS: &str = "yR9Yof";
pub const RPC_SYNC_DRIVE: &str = "FLmJqe";
pub const RPC_DELETE_SOURCE: &str = "tGMBJ";
pub const RPC_GET_CONVERSATIONS: &str = "hPTbtc";
pub const RPC_GET_SUMMARY: &str = "VfAZjd";
pub const RPC_GET_SOURCE_GUIDE: &str = "tr032e";

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Notebook {
    pub id: String,
    pub title: String,
    pub source_count: usize,
    pub sources: Vec<Value>,
    pub is_owned: bool,
    pub is_shared: bool,
    pub created_at: Option<String>,
    pub modified_at: Option<String>,
}

#[derive(Debug, Clone)]
pub struct ConversationTurn {
    pub query: String,
    pub answer: String,
    pub turn_number: usize,
}

pub struct NotebookLMClient {
    client: reqwest::Client,
    cookies: HashMap<String, String>,
    csrf_token: Arc<Mutex<String>>,
    session_id: Arc<Mutex<String>>,
    conversation_cache: Arc<Mutex<HashMap<String, Vec<ConversationTurn>>>>,
    reqid_counter: Arc<Mutex<u32>>,
}

impl NotebookLMClient {
    pub fn new(cookies: HashMap<String, String>) -> Self {
        let mut rng = rand::thread_rng();
        Self {
            client: reqwest::Client::builder()
                .cookie_store(true)
                .build()
                .unwrap(),
            cookies,
            csrf_token: Arc::new(Mutex::new(String::new())),
            session_id: Arc::new(Mutex::new(String::new())),
            conversation_cache: Arc::new(Mutex::new(HashMap::new())),
            reqid_counter: Arc::new(Mutex::new(rng.gen_range(100000..999999))),
        }
    }

    fn get_cookie_header(&self) -> String {
        self.cookies.iter()
            .map(|(k, v)| format!("{}={}", k, v))
            .collect::<Vec<_>>()
            .join("; ")
    }

    pub async fn refresh_auth_tokens(&self) -> Result<(), String> {
        let cookie_str = self.get_cookie_header();
        let mut headers = HeaderMap::new();
        headers.insert(USER_AGENT, HeaderValue::from_static("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36"));
        headers.insert(COOKIE, HeaderValue::from_str(&cookie_str).map_err(|e| e.to_string())?);

        let response = self.client.get(BASE_URL)
            .headers(headers)
            .send()
            .await
            .map_err(|e| e.to_string())?;

        if response.url().as_str().contains("accounts.google.com") {
            return Err("Authentication expired. Please re-authenticate.".to_string());
        }

        let html = response.text().await.map_err(|e| e.to_string())?;

        let csrf_re = Regex::new(r#""SNlM0e":"([^"]+)""#).unwrap();
        if let Some(cap) = csrf_re.captures(&html) {
            let mut token = self.csrf_token.lock().await;
            *token = cap[1].to_string();
        } else {
            return Err("Could not extract CSRF token from page.".to_string());
        }

        let sid_re = Regex::new(r#""FdrFJe":"([^"]+)""#).unwrap();
        if let Some(cap) = sid_re.captures(&html) {
            let mut sid = self.session_id.lock().await;
            *sid = cap[1].to_string();
        }

        Ok(())
    }

    async fn build_request_body(&self, rpc_id: &str, params: Value) -> String {
        let params_json = serde_json::to_string(&params).unwrap();
        let f_req = json!([[[rpc_id, params_json, null, "generic"]]]);
        let f_req_json = serde_json::to_string(&f_req).unwrap();

        let mut body = format!("f.req={}", urlencoding::encode(&f_req_json));
        
        let csrf = self.csrf_token.lock().await;
        if !csrf.is_empty() {
            body.push_str(&format!("&at={}", urlencoding::encode(&csrf)));
        }
        
        body.push('&');
        body
    }

    async fn build_url(&self, rpc_id: &str, source_path: &str) -> String {
        let mut url = format!("{}?rpcids={}&source-path={}&bl=boq_labs-tailwind-frontend_20260108.06_p0&hl=en&rt=c", 
            BATCHEXECUTE_URL, rpc_id, urlencoding::encode(source_path));
        
        let sid = self.session_id.lock().await;
        if !sid.is_empty() {
            url.push_str(&format!("&f.sid={}", urlencoding::encode(&sid)));
        }
        url
    }

    fn parse_response(response_text: &str) -> Vec<Value> {
        let mut text = response_text;
        if text.starts_with(")]}'") {
            text = &text[4..];
        }

        let mut results = Vec::new();
        for line in text.lines() {
            let line = line.trim();
            if line.is_empty() { continue; }

            // NotebookLM response is sometimes chunked with byte counts
            if line.chars().all(|c| c.is_digit(10)) {
                continue;
            }

            if let Ok(val) = serde_json::from_str::<Value>(line) {
                results.push(val);
            }
        }
        results
    }

    fn extract_rpc_result(parsed_response: &[Value], rpc_id: &str) -> Option<Value> {
        for chunk in parsed_response {
            if let Some(arr) = chunk.as_array() {
                for item in arr {
                    if let Some(item_arr) = item.as_array() {
                        if item_arr.len() >= 3 && item_arr[0] == "wrb.fr" && item_arr[1] == rpc_id {
                            // Check for error 16 (auth expired)
                            if item_arr.len() > 6 && item_arr[6] == "generic" {
                                if let Some(err_arr) = item_arr[5].as_array() {
                                    if err_arr.contains(&json!(16)) {
                                        // Should handle auth error
                                        return None;
                                    }
                                }
                            }

                            if let Some(result_str) = item_arr[2].as_str() {
                                if let Ok(val) = serde_json::from_str::<Value>(result_str) {
                                    return Some(val);
                                }
                                return Some(Value::String(result_str.to_string()));
                            }
                            return Some(item_arr[2].clone());
                        }
                    }
                }
            }
        }
        None
    }

    async fn call_rpc(&self, rpc_id: &str, params: Value, path: &str) -> Result<Value, String> {
        let body = self.build_request_body(rpc_id, params.clone()).await;
        let url = self.build_url(rpc_id, path).await;
        let cookie_str = self.get_cookie_header();

        let mut headers = HeaderMap::new();
        headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/x-www-form-urlencoded;charset=UTF-8"));
        headers.insert(ORIGIN, HeaderValue::from_static(BASE_URL));
        headers.insert(REFERER, HeaderValue::from_str(&format!("{}/", BASE_URL)).unwrap());
        headers.insert(COOKIE, HeaderValue::from_str(&cookie_str).map_err(|e| e.to_string())?);
        headers.insert("X-Same-Domain", HeaderValue::from_static("1"));

        let response = self.client.post(url)
            .headers(headers)
            .body(body)
            .send()
            .await
            .map_err(|e| e.to_string())?;

        let status = response.status();
        let text = response.text().await.map_err(|e| e.to_string())?;

        if status.is_client_error() || status.is_server_error() {
            // Check for auth error
            if status.as_u16() == 401 || status.as_u16() == 403 {
                // Should retry with refresh
                return Err(format!("Auth error: {}", status));
            }
            return Err(format!("HTTP error {}: {}", status, text));
        }

        let parsed = Self::parse_response(&text);
        Self::extract_rpc_result(&parsed, rpc_id).ok_or_else(|| "Failed to extract RPC result".to_string())
    }

    pub async fn list_notebooks(&self) -> Result<Vec<Notebook>, String> {
        let params = json!([null, 1, null, [2]]);
        let result = self.call_rpc(RPC_LIST_NOTEBOOKS, params, "/").await?;

        let mut notebooks = Vec::new();
        if let Some(arr) = result.as_array() {
            let notebook_list = if arr.len() > 0 && arr[0].is_array() {
                arr[0].as_array().unwrap()
            } else {
                arr
            };

            for nb_data in notebook_list {
                if let Some(nb_arr) = nb_data.as_array() {
                    if nb_arr.len() >= 3 {
                        let title = nb_arr[0].as_str().unwrap_or("Untitled").to_string();
                        let notebook_id = nb_arr[2].as_str().unwrap_or("").to_string();
                        
                        let mut is_owned = true;
                        let mut is_shared = false;
                        let mut created_at = None;
                        let mut modified_at = None;

                        if nb_arr.len() > 5 {
                            if let Some(metadata) = nb_arr[5].as_array() {
                                if !metadata.is_empty() {
                                    is_owned = metadata[0] == json!(1);
                                }
                                if metadata.len() > 1 {
                                    is_shared = metadata[1].as_bool().unwrap_or(false);
                                }
                                if metadata.len() > 5 {
                                    modified_at = self.parse_timestamp(metadata[5].clone());
                                }
                                if metadata.len() > 8 {
                                    created_at = self.parse_timestamp(metadata[8].clone());
                                }
                            }
                        }

                        let mut sources = Vec::new();
                        if nb_arr.len() > 1 {
                            if let Some(sources_data) = nb_arr[1].as_array() {
                                for src in sources_data {
                                    if let Some(src_arr) = src.as_array() {
                                        if src_arr.len() >= 2 {
                                            let src_id = if let Some(id_arr) = src_arr[0].as_array() {
                                                id_arr[0].as_str().unwrap_or("").to_string()
                                            } else {
                                                src_arr[0].as_str().unwrap_or("").to_string()
                                            };
                                            let src_title = src_arr[1].as_str().unwrap_or("Untitled").to_string();
                                            sources.push(json!({ "id": src_id, "title": src_title }));
                                        }
                                    }
                                }
                            }
                        }

                        if !notebook_id.is_empty() {
                            notebooks.push(Notebook {
                                id: notebook_id,
                                title,
                                source_count: sources.len(),
                                sources,
                                is_owned,
                                is_shared,
                                created_at,
                                modified_at,
                            });
                        }
                    }
                }
            }
        }

        Ok(notebooks)
    }

    pub async fn get_notebook(&self, notebook_id: &str) -> Result<Value, String> {
        self.call_rpc(
            RPC_GET_NOTEBOOK,
            json!([notebook_id, null, [2], null, 0]),
            &format!("/notebook/{}", notebook_id),
        ).await
    }

    pub async fn create_notebook(&self, title: &str) -> Result<String, String> {
        let params = json!([title, null, [2]]);
        let result = self.call_rpc(RPC_CREATE_NOTEBOOK, params, "/").await?;
        
        if let Some(notebook_id) = result.as_str() {
            return Ok(notebook_id.to_string());
        }
        
        // Sometimes the result is a list with the ID
        if let Some(arr) = result.as_array() {
            if !arr.is_empty() {
                if let Some(id) = arr[0].as_str() {
                    return Ok(id.to_string());
                }
            }
        }

        Err("Failed to extract notebook ID from creation result".to_string())
    }

    pub async fn delete_notebook(&self, notebook_id: &str) -> Result<bool, String> {
        let params = json!([[notebook_id], [2]]);
        let result = self.call_rpc(RPC_DELETE_NOTEBOOK, params, "/").await?;
        Ok(result.is_null() || result.as_array().map(|a| a.is_empty()).unwrap_or(false))
    }

    pub async fn get_notebook_summary(&self, notebook_id: &str) -> Result<Value, String> {
        let result = self.call_rpc(
            RPC_GET_SUMMARY,
            json!([notebook_id, [2]]),
            &format!("/notebook/{}", notebook_id),
        ).await?;

        let mut summary = String::new();
        let mut suggested_topics = Vec::new();

        if let Some(arr) = result.as_array() {
            if !arr.is_empty() {
                if let Some(s) = arr[0][0].as_str() {
                    summary = s.to_string();
                }
            }
            if arr.len() > 1 {
                if let Some(topics) = arr[1][0].as_array() {
                    for topic in topics {
                        if let Some(t_arr) = topic.as_array() {
                            if t_arr.len() >= 2 {
                                suggested_topics.push(json!({
                                    "question": t_arr[0],
                                    "prompt": t_arr[1],
                                }));
                            }
                        }
                    }
                }
            }
        }

        Ok(json!({
            "summary": summary,
            "suggested_topics": suggested_topics,
        }))
    }

    pub async fn rename_notebook(&self, notebook_id: &str, new_title: &str) -> Result<bool, String> {
        let params = json!([notebook_id, [[null, null, null, [null, new_title]]]]);
        let result = self.call_rpc(RPC_RENAME_NOTEBOOK, params, &format!("/notebook/{}", notebook_id)).await?;
        Ok(!result.is_null())
    }

    pub fn extract_all_text(&self, data: &Value) -> Vec<String> {
        let mut texts = Vec::new();
        match data {
            Value::String(s) => {
                if !s.is_empty() {
                    texts.push(s.clone());
                }
            }
            Value::Array(arr) => {
                for item in arr {
                    texts.extend(self.extract_all_text(item));
                }
            }
            _ => {}
        }
        texts
    }

    pub async fn get_source_fulltext(&self, notebook_id: &str, source_id: &str) -> Result<String, String> {
        let result = self.call_rpc(
            RPC_GET_SOURCE,
            json!([notebook_id, [source_id], [2]]),
            &format!("/notebook/{}", notebook_id),
        ).await?;

        let texts = self.extract_all_text(&result);
        Ok(texts.join("\n"))
    }

    pub async fn query_streaming(&self, notebook_id: &str, query: &str) -> Result<reqwest::Response, String> {
        let reqid = {
            let mut counter = self.reqid_counter.lock().await;
            *counter += 1;
            *counter
        };

        let params = json!([
            notebook_id,
            [[null, null, null, null, null, [query, null, null, null, 1], null, null, null, [2]]],
            null,
            null,
            reqid
        ]);

        let rpc_id = "vVvFcc"; // Streaming RPC ID
        let body = self.build_request_body(rpc_id, params).await;
        let url = self.build_url(rpc_id, &format!("/notebook/{}", notebook_id)).await;
        let cookie_str = self.get_cookie_header();

        let mut headers = HeaderMap::new();
        headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/x-www-form-urlencoded;charset=UTF-8"));
        headers.insert(COOKIE, HeaderValue::from_str(&cookie_str).map_err(|e| e.to_string())?);

        self.client.post(url)
            .headers(headers)
            .body(body)
            .send()
            .await
            .map_err(|e| e.to_string())
    }

    pub async fn query(&self, notebook_id: &str, query: &str) -> Result<String, String> {
        let response = self.query_streaming(notebook_id, query).await?;
        let text = response.text().await.map_err(|e| e.to_string())?;
        Ok(self.parse_query_response(&text))
    }

    pub fn parse_query_response(&self, response_text: &str) -> String {
        let mut text = response_text;
        if text.starts_with(")]}'") {
            text = &text[4..];
        }

        let mut longest_answer = String::new();
        let mut longest_thinking = String::new();

        for line in text.lines() {
            let line = line.trim();
            if line.is_empty() || line.chars().all(|c| c.is_digit(10)) {
                continue;
            }

            if let Ok(val) = serde_json::from_str::<Value>(line) {
                if let Some((content, is_answer)) = self.extract_answer_from_chunk(&val) {
                    if is_answer {
                        if content.len() > longest_answer.len() {
                            longest_answer = content;
                        }
                    } else {
                        if content.len() > longest_thinking.len() {
                            longest_thinking = content;
                        }
                    }
                }
            }
        }

        if !longest_answer.is_empty() {
            longest_answer
        } else {
            longest_thinking
        }
    }

    fn extract_answer_from_chunk(&self, data: &Value) -> Option<(String, bool)> {
        if let Some(arr) = data.as_array() {
            for item in arr {
                if let Some(item_arr) = item.as_array() {
                    if item_arr.len() >= 3 && item_arr[0] == "wrb.fr" {
                        if let Some(inner_str) = item_arr[2].as_str() {
                            if let Ok(inner_val) = serde_json::from_str::<Value>(inner_str) {
                                if let Some(inner_arr) = inner_val.as_array() {
                                    if !inner_arr.is_empty() {
                                        let first = &inner_arr[0];
                                        if let Some(first_arr) = first.as_array() {
                                            if !first_arr.is_empty() {
                                                if let Some(answer) = first_arr[0].as_str() {
                                                    let mut is_answer = false;
                                                    if first_arr.len() > 4 {
                                                        if let Some(type_info) = first_arr[4].as_array() {
                                                            if !type_info.is_empty() {
                                                                if let Some(code) = type_info.last().and_then(|v| v.as_i64()) {
                                                                    is_answer = code == 1;
                                                                }
                                                            }
                                                        }
                                                    }
                                                    return Some((answer.to_string(), is_answer));
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        None
    }

    fn parse_timestamp(&self, ts_val: Value) -> Option<String> {
        if let Some(arr) = ts_val.as_array() {
            if !arr.is_empty() {
                if let Some(seconds) = arr[0].as_i64() {
                    let dt = Utc.timestamp_opt(seconds, 0).single();
                    return dt.map(|d| d.format("%Y-%m-%dT%H:%M:%SZ").to_string());
                }
            }
        }
        None
    }
}
