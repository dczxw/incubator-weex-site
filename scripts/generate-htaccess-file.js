const fs = require('fs-extra');
const path = require('path');

const target = path.join(__dirname, '../.deploy_git/')
const redirectDate = path.join(__dirname, '../docs/.vuepress/data/redirect.json');

async function generate () {
  const output = '.htaccess'
  await fs.ensureFile(path.join(target, output))
  fs.writeFile(path.join(target, output), 
`###############################################################################
# WARNING
###############################################################################
# Only modify this file if you know what you're doing. This file has
# the potential to make pages become PERMANENTLY UNREACHABLE. If in
# doubt, refer to these links:
#
# RewriteRule       - http://httpd.apache.org/docs/current/mod/mod_rewrite.html
# RewriteRule flags - http://httpd.apache.org/docs/current/rewrite/flags.html
# .htaccess tester  - http://htaccess.madewithlove.be/
#
# And remember: three-oh-ONE (301) menas you get ONE chance to get it right;
#               three-oh-TWO (302) means you get TWO chances.
###############################################################################

# set error pages
ErrorDocument 404 https://weex.apache.org/404.html

# turn off automatic directory indices
#Options -Indexes

# turn on redirection
Options +FollowSymLinks
RewriteEngine on

#
# NOTE:
#      Meanings of some of the flags at the ends of rules:
#
#      L  - terminal rule; if it applies, no more rules are checked
#      R  - redirect (followed by code)
#      NE - no escaping special characters

# 302 (temporary):
#
#     references/modules/         -> docs/modules/
#     cn/references/modules/      -> zh/docs/api/modules/
#     references/components/         -> docs/components/
#     cn/references/components/      -> zh/docs/api/components/
#

RewriteRule "^.*cn/references/modules/(.*)$" "https://weex.apache.org/zh/docs/modules/$1" [R=301,L]
RewriteRule "^.*references/modules/(.*)$" "https://weex.apache.org/docs/modules/$1" [R=301,L]
RewriteRule "^.*cn/references/components/(.*)$" "https://weex.apache.org/zh/docs/components/$1" [R=301,L]
RewriteRule "^.*references/components/(.*)$" "https://weex.apache.org/docs/components/$1" [R=301,L]

# Redirect http to https
# From Cordova PMC Member raphinesse 
# https://s.apache.org/An8s

# If we receive a forwarded http request from a proxy...
RewriteCond %{HTTP:X-Forwarded-Proto} =http [OR]

# ...or just a plain old http request directly from the client
RewriteCond %{HTTP:X-Forwarded-Proto} =""
RewriteCond %{HTTPS} !=on

# Redirect to https version
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`, (error) => {
      if (error) {
        console.error(`Generate .htaccess error: ${error && error.stack}`)
      }
    })
}

generate()