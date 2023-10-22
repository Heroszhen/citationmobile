import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as aws from "aws-sdk";
import { HeadObjectOutput } from 'aws-sdk/clients/s3';

@Injectable({
  providedIn: 'root'
})
export class TestService extends BaseService {
  client: aws.S3;

  constructor(http: HttpClient) { 
    super();
    this.client = new aws.S3({
      apiVersion: '2006-03-01',
      accessKeyId: environment.aws_s3_accessKeyId,
      secretAccessKey: environment.aws_s3_secretAccessKey,
      region: "eu-west-3",
    });
  }

  async getCloud(): Promise<aws.S3.ObjectList | undefined> {
    let { Contents } = await this.client.listObjectsV2({
      Bucket: environment.aws_s3_bucket,
      Prefix: "cloud/"
    }).promise();
    
    return Contents;
  }

  async getHead(key:string): Promise<HeadObjectOutput> {
    return await this.client
            .headObject({
                Bucket: environment.aws_s3_bucket,
                Key: key
            })
            .promise();
  }

  async getSignedUrl(key:string): Promise<string> {
    return await this.client.getSignedUrlPromise("getObject", {
      Bucket: environment.aws_s3_bucket,
      Key: key,
      Expires: 300
    })
  }
}
