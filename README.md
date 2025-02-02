# Service Levels Blueprints

Infrastructure code for creating all of the alarms and dashboards associated with the Service Level Objectives that we've defined for our services.

## Before deploying

- update all packages using these commands 
```
  npx npm-check-updates -u
  npm install
```



## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk list` list all stacks that will be created by this app
- `cdk deploy service-levels-*` deploy all stacks to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template


# Notes

- 2022-06-07 I removed all latency alarms.  These are saved in cdk.context.json.saved_2022-06-07 so we can easily re-instate them when we have more staff.
