mod api_client;

use api_client::{Notebook, NotebookLMClient};
use std::collections::HashMap;
use std::sync::Arc;
use tauri::{Manager, State};
use tokio::sync::Mutex;

struct AppState {
    client: Mutex<Option<NotebookLMClient>>,
}

#[tauri::command]
async fn authenticate(
    state: State<'_, AppState>,
    cookies: HashMap<String, String>,
) -> Result<String, String> {
    let client = NotebookLMClient::new(cookies);
    client.refresh_auth_tokens().await?;
    
    let mut state_client = state.client.lock().await;
    *state_client = Some(client);
    
    Ok("Authenticated successfully".to_string())
}

#[tauri::command]
async fn list_notebooks(state: State<'_, AppState>) -> Result<Vec<Notebook>, String> {
    let client_lock = state.client.lock().await;
    let client = client_lock.as_ref().ok_or("Not authenticated")?;
    client.list_notebooks().await
}

#[tauri::command]
async fn create_notebook(state: State<'_, AppState>, title: String) -> Result<String, String> {
    let client_lock = state.client.lock().await;
    let client = client_lock.as_ref().ok_or("Not authenticated")?;
    client.create_notebook(&title).await
}

#[tauri::command]
async fn delete_notebook(state: State<'_, AppState>, notebook_id: String) -> Result<bool, String> {
    let client_lock = state.client.lock().await;
    let client = client_lock.as_ref().ok_or("Not authenticated")?;
    client.delete_notebook(&notebook_id).await
}

#[tauri::command]
async fn get_notebook_summary(state: State<'_, AppState>, notebook_id: String) -> Result<serde_json::Value, String> {
    let client_lock = state.client.lock().await;
    let client = client_lock.as_ref().ok_or("Not authenticated")?;
    client.get_notebook_summary(&notebook_id).await
}

#[tauri::command]
async fn ask_notebook(state: State<'_, AppState>, notebook_id: String, query: String) -> Result<String, String> {
    let client_lock = state.client.lock().await;
    let client = client_lock.as_ref().ok_or("Not authenticated")?;
    client.query(&notebook_id, &query).await
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AppState {
            client: Mutex::new(None),
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            authenticate,
            list_notebooks,
            create_notebook,
            delete_notebook,
            get_notebook_summary,
            ask_notebook
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
