import { NextRequest } from 'next/server';
import { handleChat } from '@/lib/ai';
import { McpOAuthService } from '@/lib/mcp/oauth-service';
import { oauthStorage } from '@/lib/mcp/storage';

const oauthService = new McpOAuthService({
  clientId: process.env.CLIENT_ID || '',
  redirectUri: process.env.REDIRECT_URI || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, mode, sandboxId } = body;

    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      );
    }

    // Check for OAuth requirement
    const docsUrl = process.env.DOCS_URL;
    if (docsUrl && !oauthService.isAuthenticated(docsUrl)) {
      // Return 401 with WWW-Authenticate header to trigger OAuth flow
      return new Response('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': `Bearer resource="${docsUrl}"`,
        },
      });
    }

    // Handle chat with streaming
    const response = await handleChat({
      messages,
      mode,
      sandboxId,
    });

    return response;
  } catch (error) {
    console.error('Chat API error:', error);

    // Handle OAuth token expiry (401 from upstream)
    if (error instanceof Error && error.message.includes('401')) {
      // Clear expired token and trigger re-auth
      const docsUrl = process.env.DOCS_URL;
      if (docsUrl) {
        oauthStorage.removeToken(docsUrl);
      }

      return new Response('Token expired. Please re-authenticate.', {
        status: 401,
        headers: {
          'WWW-Authenticate': `Bearer resource="${docsUrl}"`,
        },
      });
    }

    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Handle OAuth callback
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Safe redirect with validated parameters
  const safeRedirect = (params: Record<string, string>) => {
    const url = new URL('/', request.url);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return Response.redirect(url);
  };

  if (error) {
    // Validate error parameter to prevent open redirect
    const sanitizedError = error.replace(/[^a-zA-Z0-9_-]/g, '');
    return safeRedirect({ error: sanitizedError });
  }

  if (!code || !state) {
    return safeRedirect({ error: 'invalid_callback' });
  }

  try {
    const docsUrl = process.env.DOCS_URL || '';
    await oauthService.handleCallback(request.url, docsUrl);

    // Redirect to success page - safe internal redirect
    return safeRedirect({ auth: 'success' });
  } catch (err) {
    console.error('OAuth callback error:', err);
    const sanitizedMessage = encodeURIComponent((err as Error).message).replace(/[^a-zA-Z0-9_%-]/g, '');
    return safeRedirect({ error: sanitizedMessage });
  }
}
