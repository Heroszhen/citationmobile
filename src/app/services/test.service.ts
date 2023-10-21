import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import * as aws from "aws-sdk";

@Injectable({
  providedIn: 'root'
})
export class TestService extends BaseService{

  constructor(http: HttpClient) { 
    super();
  }

  async getCloud(): Promise<aws.S3.ObjectList | undefined> {
    let s3 = new aws.S3({
      apiVersion: '2006-03-01',
      accessKeyId: "AKIAVE4EF2SKA3VCBMZZ",
      secretAccessKey: "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",
      region: "eu-west-3",
    });

    let { Contents } = await s3.listObjectsV2({
      Bucket: "citationcloud",
      Prefix: "cloud/"
    }).promise();
    
    return Contents;
  }
  
}
