const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const template = require('./lib/template');
const path = require('path');
const sanitizeHtml = require('sanitize-html');

const app = http.createServer(function(request, response){
    const queryData = url.parse(request.url,true).query;
    // console.log(url.parse(request.url,true));
    // const title = queryData.id;
    const pathname = url.parse(request.url,true).pathname;
    if(pathname === '/'){
        if(queryData.id !== undefined){
            fs.readdir(`./data`,'utf-8',(error, filelist)=>{
                const filtered = path.parse(queryData.id).base;
                fs.readFile(`./data/${filtered}`,'utf-8',(error,data)=>{
                    const title = queryData.id;
                    const sanitizedtitle = sanitizeHtml(title,{
                        allowedTags:['h1']
                    });
                    const sanitizedDescription = sanitizeHtml(data);
                    const list = template.link(filelist);         
                    const html = template.html(sanitizedtitle,list,sanitizedDescription,
                        `<a href="/create">create</a>
                        <a href="/update?id=${sanitizedtitle}">update</a>
                        <form action="/delete_process" method="post">
                            <input type="hidden" name="id" value="${sanitizedtitle}">
                            <p><input type="submit" value="delete"></p>
                        </form>`
                    );
                    response.writeHead(200);
                    response.end(html);
                });
            });
        } else {
            fs.readdir(`./data`,'utf-8',(error, filelist)=>{
                const title = 'WELCOME';
                const data = 'NODE. JS';
                const list = template.link(filelist);         
                const html = template.html(title,list,data,
                    `<a href="/create">create</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
        }
    } else if(pathname === '/create'){
        fs.readdir(`./data`,'utf-8',(error, filelist)=>{
            const title = 'CREATE';
            const data = `<form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <p><input type="submit" value="create"></p>
            </form>`;
            const list = template.link(filelist);         
            const html = template.html(title,list,data,``);
            response.writeHead(200);
            response.end(html);
        });
    } else if(pathname === '/create_process'){
        let body = ``;
        request.on('data',data=>{
            body += data;
        });
        request.on('end',()=>{
            const post = qs.parse(body);
            // console.log(post);
            const filtered = path.parse(post.title).base;           
            fs.writeFile(`./data/${filtered}`,post.description,'utf-8',error=>{
                response.writeHead(302,{location:`/?id=${post.title}`});
                response.end();
            });
        });
    } else if(pathname === `/update`){
        fs.readdir(`./data`,'utf-8',(error, filelist)=>{
            const filtered = path.parse(queryData.id).base;
            fs.readFile(`./data/${filtered}`,'utf-8',(error,data)=>{
                const title = 'UPDATE';
                const list = template.link(filelist);         
                const html = template.html(title,list,``,
                    `<form action="/create_process" method="post">
                    <input type="hidden" name="id" value"${queryData.id}">
                    <p><input type="text" name="title" placeholder="title" value="${queryData.id}"></p>
                    <p><textarea name="description" placeholder="description">${data}</textarea></p>
                    <p><input type="submit" value="create"></p>
                </form>`
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    } else if(pathname === `/update_process`){
        let body = ``;
        request.on('data',data=>{
            body += data;
        });
        request.on('end',()=>{
            const post = qs.parse(body);
            // console.log(post);
            fs.rename(`./data/${post.id}`,`./data/${title}`,error=>{
                fs.writeFile(`./data/${post.title}`,post.description,'utf-8',error=>{
                    response.writeHead(302,{location:`/?id=${post.title}`});
                    response.end();
                });
            });
        });
    } else if(pathname === `/delete_process`){
        let body = ``;
        request.on('data',data=>{
            body += data;
        });
        request.on('end',()=>{
            const post = qs.parse(body);
            console.log(post);
            const filtered = path.parse(post.id).base;
            fs.unlink(`./data/${filtered}`,error=>{
                response.writeHead(302,{location:`/`});
                response.end();
            });
        });
    } else {
        response.writeHead(404);
        response.end('not FOUND');
    }
});
app.listen(3000);