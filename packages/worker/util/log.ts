export class Log {
  public static e(tag: string, message: string): void {
    console.log(`%c [${tag}] - ${message}`, 'color: red');
  }
  public static d(tag: string, message: string): void {
    console.log(`%c [${tag}] - ${message}`, 'color: blue');
  }
}
