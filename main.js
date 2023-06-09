const http = require('http');
const url = require('url');
const topic = require(`./lib/topic`);
const author = require(`./lib/author`);
const sanitize = require('sanitize-html');

const app = http.createServer(function(request, response){
    const queryData = url.parse(request.url,true).query;
    // console.log(url.parse(request.url,true));
    // const title = queryData.id;
    const pathname = url.parse(request.url,true).pathname;
    if(pathname === '/'){
        if(queryData.id !== undefined){
            topic.page(request,response);
        } else {
            topic.home(request,response);
        }
    } else if(pathname === '/create'){
        topic.create(request,response);
    } else if(pathname === '/create_process'){
        topic.create_process(request,response);
    } else if(pathname === `/update`){
        topic.update(request,response);
    } else if(pathname === `/update_process`){
        topic.update_process(request,response);
    } else if(pathname === `/delete_process`){
        topic.delete_process(request,response);
    } else if(pathname === `/author`){
        author.home(request,response,request.url);
        // console.log("request.url",request.url);
    } else if(pathname === '/create_process_author'){
        author.create_process_author(request,response);
    } else if(pathname === '/update_author'){
        author.update_author(request,response);
    } else if(pathname === '/update_process_author'){
        author.update_process_author(request,response);
    } else if(pathname === `/delete_process_author`){
        author.delete_process_author(request,response);
    } else {
        response.writeHead(404);
        response.end('not FOUND');
    }
});
app.listen(3000);