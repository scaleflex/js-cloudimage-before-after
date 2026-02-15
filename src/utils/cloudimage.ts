import type { CloudimageConfig } from '../core/types';

const TOKEN_PATTERN = /^[a-zA-Z0-9_-]+$/;
const DOMAIN_PATTERN = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const API_VERSION_PATTERN = /^v\d+$/;

function validateCloudimageConfig(config: CloudimageConfig): void {
  if (!TOKEN_PATTERN.test(config.token)) {
    throw new Error(`CIBeforeAfter: Invalid cloudimage token "${config.token}". Must match [a-zA-Z0-9_-]+`);
  }
  if (config.domain && !DOMAIN_PATTERN.test(config.domain)) {
    throw new Error(`CIBeforeAfter: Invalid cloudimage domain "${config.domain}".`);
  }
  if (config.apiVersion && !API_VERSION_PATTERN.test(config.apiVersion)) {
    throw new Error(`CIBeforeAfter: Invalid cloudimage apiVersion "${config.apiVersion}". Must be "v" followed by digits.`);
  }
}

export function buildCloudimageUrl(
  src: string,
  containerWidth: number,
  config: CloudimageConfig,
): string {
  validateCloudimageConfig(config);

  const {
    token,
    apiVersion = 'v7',
    domain = 'cloudimg.io',
    limitFactor = 100,
    params = '',
    devicePixelRatioList = [1, 1.5, 2],
  } = config;

  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const dprList = devicePixelRatioList.length > 0 ? devicePixelRatioList : [1];
  const closestDpr = dprList.reduce((prev, curr) =>
    Math.abs(curr - dpr) < Math.abs(prev - dpr) ? curr : prev,
  );

  const safeLimitFactor = limitFactor > 0 ? limitFactor : 100;
  const rawWidth = containerWidth * closestDpr;
  const roundedWidth = Math.ceil(rawWidth / safeLimitFactor) * safeLimitFactor;

  const baseUrl = `https://${token}.${domain}/${apiVersion}`;
  // Params are expected to be valid query string segments (e.g. "q=80&org_if_sml=1")
  const paramStr = params
    ? `?${params}&w=${roundedWidth}`
    : `?w=${roundedWidth}`;

  if (src.startsWith('http://') || src.startsWith('https://')) {
    return `${baseUrl}/${src}${paramStr}`;
  }

  return `${baseUrl}/${src}${paramStr}`;
}
