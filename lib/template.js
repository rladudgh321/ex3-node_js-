const sanitize = require('sanitize-html');
module.exports = {
    html:function(title,list,data,control,url){
        // console.log("turl",url);
        let author = '';
        if(url === '/author'){
            author = `<a href="/">topic</a>`;
        } else {
            author = `<a href="/author">author</a>`;
        }
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>WEB - ${sanitize(title)}</title>
            <link rel="icon" href="data:,">
            </head>
        <body>
            <h1><a href="/">web</a></h1>
                ${author}
            <ol>
                ${list}
            </ol>
            <h2>${sanitize(title)}</h2>
            <p>${sanitize(data)}</p>
            ${control}
        </body>
        </html>
        `;
    },

    link: function(filelist){
        let list = ``;
        for(let i=0;i<filelist.length;i++){
            list += `<li><a href="/?id=${filelist[i].id}">${sanitize(filelist[i].title)}</a></li>` 
        }
        return list;
    },

    authorLink: function(authors, author_id){
        let select_form = `<select name="author_id">`;
        for(let i=0;i<authors.length;i++){
            let selected = ``;
            //    author Id       topic author_id
            if(authors[i].id === author_id){
                selected = ` selected`;
            }
            select_form += `<option value="${authors[i].id}"${selected}>${sanitize(authors[i].name)}</option>`;
            
        }
        select_form += `</select>`;
        return select_form;
    },

    authorHome: function(authors){
        let tag =`<table border=1>
        <tr>
            <td>id<td>
            <td>name<td>
            <td>profile<td>
            <td>update</td>
            <td>delete</td>
        </tr>`;
        for(let i=0;i<authors.length;i++){
            tag += `
                <tr>
                    <td>${authors[i].id}<td>
                    <td>${authors[i].name}<td>
                    <td>${authors[i].profile}<td>
                    <td><a href="/author?id=${authors[i].id}">update</a></td>
                    <td>
                        <form action="/delete_process_author" method="post">
                            <input type="hidden" name="id" value="${authors[i].id}">
                            <input type="submit" value="delete">
                        </form>
                    </td>
                </tr>
            `;
        }
        tag += `</table>`;

        return tag;
    }
}
