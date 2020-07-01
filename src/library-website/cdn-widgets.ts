import * as widgets from '../widgets';
import { Shading } from '@aws-cdk/aws-cloudwatch';

const distributionId = 'E1560Z89H1UDHK';
export const rows = [
  [ widgets.header("HTTP CDN", "Static assets using CloudFront + S3") ],
  [ widgets.cloudfrontErrors(distributionId), widgets.cloudfrontLatency(distributionId)],
];
