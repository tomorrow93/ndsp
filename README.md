## 项目初始化

#### 一. vue环境搭建
  - https://blog.csdn.net/ytangdigl/article/details/75095787

#### 二. git拉取项目
  - git clone -b dev https://gitlab.fuseclick.com/ndsp/ndsp-management.git

#### 三. 初始化项目
  1. 进入工程目录: cd ndsp-management/ndsp-management-frontend
  2. 安装项目依赖: npm install
  3. 编译项目: npm run build
  4. 编译生成的dist文件夹移动到/usr/share/nginx/html下(或nginx指向该路径)

#### 四. nginx配置(示例)
```
server {
    listen       8087 default_server;
    listen       [::]:8087 default_server;
    server_name  _;
    root         /usr/share/nginx/html;

    # Load configuration files for the default server block.
    include /etc/nginx/default.d/*.conf;

    location / {
    }

    error_page 404 /404.html;
        location = /40x.html {
    }

    error_page 500 502 503 504 /50x.html;
        location = /50x.html {
    }

}
```
以上配置后访问:http://ip:8087/dist 即可

