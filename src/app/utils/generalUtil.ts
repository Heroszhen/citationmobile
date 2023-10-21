/**
 * @exemple 
 * await wait(1);
 * 
 * @exemple
 * await wait(0.5);
 */
export function wait(seconds:number): Promise<number> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(1);
        }, seconds * 1000);
      });
}