const accessControlAllowHeaders = [
  'Content-Type',
  'X-Amz-Date',
  'Authorization',
  'X-Api-Key',
  'X-Auth-Token',
  'X-Amz-Security-Token',
  'X-Amz-User-Agent',
  'Access-Control-Request-Method',
  'Access-Control-Request-Headers',
];

function getCapHeaderValue(header: string): string {
  return header
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-');
}

function getSmlHeaderValue(header: string): string {
  return header
    .split('-')
    .map(word => word.charAt(0).toLowerCase() + word.slice(1))
    .join('-');
}

export function getHeaderValue(headers: object, header: string): any {
  const capHeader = getCapHeaderValue(header);
  const smlHeader = getSmlHeaderValue(header);
  let headerValue = null;

  if (headers[capHeader]) {
    headerValue = headers[capHeader];
  } else if (headers[smlHeader]) {
    headerValue = headers[smlHeader];
  }

  return headerValue;
}

function getCorsHeaders(requestHeaders: object = {}, allowMethods: Array<string>) {
  return {
    'access-control-allow-headers': accessControlAllowHeaders.join(','),
    'access-control-allow-methods': allowMethods.join(','),
    'access-control-allow-origin': getHeaderValue(requestHeaders, 'origin') || '*',
  };
}

export { getCorsHeaders };
