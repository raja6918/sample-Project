var maven = require('maven-deploy');
var fs = require('fs-extra');

fs.copySync('web.xml', 'build/WEB-INF/web.xml');

var config = {
  groupId: 'adopt',
  artifactId: 'kronos',
  buildDir: 'build',
  finalName: process.env.ALTITUDE_ROUTER_BASE || 'kronos',
  type: 'war',
  fileEncoding: 'utf-8',
  generatePom: false,
  version: '1.0.0-SNAPSHOT',
  repositories: [
    {
      id: 'adopt',
      url: 'http://pap-mtl-art01.ca.kronos.com/artifactory/alt-snapshot-local'
    }
  ]
};

maven.config(config);
maven.package();
// maven.deploy('adopt', true);
