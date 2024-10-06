export class VK_API_Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VK_API_Error';
  }
}

export class VK_AUTH_Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VK_AUTH_Error';
  }
}
