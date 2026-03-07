// ─── Image Processing Service ─────────────────────────────────
// Abstraction layer for server-side try-on compositing.
// Currently implements a pass-through mode that returns rendering
// instructions for client-side AR rendering, with a placeholder
// for future server-side compositing (e.g. via sharp or Canvas).

export interface TryOnLayer {
  assetId: string;
  assetType: string;
  textureUrl?: string;
  modelUrl: string;
  anchorPoint: string;
  blendMode: string;
  opacity: number;
  scale?: { x: number; y: number; z: number };
  offset?: { x: number; y: number; z: number };
}

export interface TryOnRequest {
  sessionId: string;
  userId?: string;
  mode: 'client' | 'server';
  baseImageUrl?: string;
  baseImageBuffer?: Buffer;
  layers: TryOnLayer[];
}

export interface CompositeInstruction {
  faceAnchors: Record<string, { x: number; y: number }>;
  layers: Array<TryOnLayer & { zIndex: number }>;
}

export interface TryOnResult {
  sessionId: string;
  mode: 'client' | 'server';
  layers: TryOnLayer[];
  compositeUrl?: string;
  renderInstructions: CompositeInstruction;
}

export interface ThumbnailResult {
  url: string;
  width: number;
  height: number;
}

// ─── Default face anchor positions (normalized 0-1) ──────────

const DEFAULT_FACE_ANCHORS: Record<string, { x: number; y: number }> = {
  forehead: { x: 0.5, y: 0.18 },
  left_eye: { x: 0.35, y: 0.35 },
  right_eye: { x: 0.65, y: 0.35 },
  nose: { x: 0.5, y: 0.48 },
  left_cheek: { x: 0.28, y: 0.52 },
  right_cheek: { x: 0.72, y: 0.52 },
  lips: { x: 0.5, y: 0.68 },
  chin: { x: 0.5, y: 0.82 },
  full_face: { x: 0.5, y: 0.5 },
  head: { x: 0.5, y: 0.12 },
};

// ─── Z-index ordering by anchor point ────────────────────────

const ANCHOR_Z_ORDER: Record<string, number> = {
  head: 0,
  forehead: 1,
  left_eye: 2,
  right_eye: 2,
  nose: 3,
  left_cheek: 4,
  right_cheek: 4,
  lips: 5,
  chin: 6,
  full_face: 10,
};

// ─── Build rendering instructions for client-side mode ───────

function buildRenderInstructions(layers: TryOnLayer[]): CompositeInstruction {
  // Collect only the face anchors that are actually used
  const usedAnchors: Record<string, { x: number; y: number }> = {};
  for (const layer of layers) {
    const anchor = layer.anchorPoint || 'full_face';
    if (DEFAULT_FACE_ANCHORS[anchor]) {
      usedAnchors[anchor] = DEFAULT_FACE_ANCHORS[anchor];
    }
  }

  // Build ordered layer list with z-index
  const orderedLayers = layers.map((layer, index) => ({
    ...layer,
    zIndex: ANCHOR_Z_ORDER[layer.anchorPoint] ?? (100 + index),
  }));

  orderedLayers.sort((a, b) => a.zIndex - b.zIndex);

  return {
    faceAnchors: usedAnchors,
    layers: orderedLayers,
  };
}

// ─── Server-side compositing placeholder ─────────────────────

async function composeServerSide(request: TryOnRequest): Promise<TryOnResult> {
  // TODO: Implement actual server-side compositing using sharp or node-canvas
  // For now, return a mock result that includes the rendering instructions
  // so the client can fall back to client-side rendering if needed.
  const renderInstructions = buildRenderInstructions(request.layers);

  return {
    sessionId: request.sessionId,
    mode: 'server',
    layers: request.layers,
    compositeUrl: `https://cdn.maikup.app/composites/${request.sessionId}.png`,
    renderInstructions,
  };
}

// ─── Public API ──────────────────────────────────────────────

/**
 * Build a try-on session with rendering instructions.
 * In 'client' mode, returns layer data and face anchor positions
 * for the mobile/web client to render via AR.
 * In 'server' mode, returns a (currently mocked) composite image URL.
 */
export async function buildTryOnSession(request: TryOnRequest): Promise<TryOnResult> {
  if (request.mode === 'server') {
    return composeServerSide(request);
  }

  // Client mode: return rendering instructions only
  const renderInstructions = buildRenderInstructions(request.layers);

  return {
    sessionId: request.sessionId,
    mode: 'client',
    layers: request.layers,
    renderInstructions,
  };
}

/**
 * Compose a try-on image from a base image and overlay layers.
 * Currently a pass-through that returns mock data.
 */
export async function composeTryOn(
  baseImageUrl: string | undefined,
  _baseImageBuffer: Buffer | undefined,
  layers: TryOnLayer[]
): Promise<{ url: string; width: number; height: number }> {
  // TODO: Implement actual compositing with sharp or similar
  // For now return a placeholder result
  return {
    url: baseImageUrl || 'https://cdn.maikup.app/composites/placeholder.png',
    width: 1080,
    height: 1920,
  };
}

/**
 * Generate a thumbnail for a composited try-on image.
 * Currently returns a mock result.
 */
export async function generateThumbnail(
  _imageUrl: string,
  width = 256,
  height = 256
): Promise<ThumbnailResult> {
  // TODO: Implement actual thumbnail generation with sharp
  return {
    url: `https://cdn.maikup.app/thumbnails/placeholder_${width}x${height}.png`,
    width,
    height,
  };
}
