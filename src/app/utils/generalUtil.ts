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

/**
 * 
 * @param {File} file 
 * @returns {Promise<string>}
 */
export function readFile(file:File):Promise<string>{
  return new Promise((resolve,err) => {
    let reader = new FileReader();
    reader.onload = (e:ProgressEvent) => {
      let result:string|ArrayBuffer|null = (e.target as FileReader).result
      if (result === null) {
        resolve("");
      } else {
        if (typeof result !== 'string') result = result.toString();
        resolve(result);
      }
    };
    reader.readAsDataURL(file);
  });
}

export function isMobileNavigator():boolean {
  let useragent = navigator.userAgent.toLowerCase();
  const regex = RegExp('.*mobile.*');
  if(regex.test(useragent))return true;
  return false;
}