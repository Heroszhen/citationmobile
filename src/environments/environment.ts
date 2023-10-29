// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //baseUrl: "https://citation-nodejs-api.onrender.com",
  baseUrl: "http://localhost:3000",
  aws_s3_accessKeyId:"AKIAVE4EF2SKA3VCBMZZ",
  aws_s3_secretAccessKey:"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",
  aws_s3_bucket:"citationcloud"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
