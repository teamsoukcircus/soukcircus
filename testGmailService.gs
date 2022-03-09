function test_gmail_doRequest()
{    
     let resp1 = gmail_doRequest(Requests.MESSAGES);

    var result = resp1.getResponseCode();
    if (result == '200') 
    {  // OK
      var msgs= JSON.parse(resp1.getContentText());

      let messages = msgs["messages"];
      let conversations=[];
      for (let i=0;i< messages.length;i++)
      {       
        let req = 'https://gmail.googleapis.com/gmail/v1/users/' + targetUser + '/messages/'+ messages[i]["id"];

        let resp2 = gmail_doRequest(req);

        result = resp2.getResponseCode();

        if (result == '200') 
        {  // OK
          var msg= JSON.parse(resp2.getContentText());
          let aConv={};
          let headers = msg.payload.headers;
          for(let i=0;i<headers.length;i++)
          {
            if ( headers[i].name == "Date" || headers[i].name == "Subject" ||
                  headers[i].name == "From" || headers[i].name == "To" )
              aConv[headers[i].name] = headers[i].value
          }

          conversations.push(aConv)
        }
        else
        {
            Logger.log("ERROR: " + result);
        }
      }

         
      if ( conversations.length > 0)
      {
          stories={};
          let aStory= {};

          let ft = conversations[0].From+conversations[0].To;
          stories[ft] = {}

          stories[ft]["A"] = conversations[0].From
          stories[ft]["B"] = conversations[0].To
          stories[ft]["Dial"] =[]

          stories[ft]["Dial"].push([">>",conversations[0].Date,conversations[0].Subject])

          for (let i=0;i<conversations.length;i++)
          {
              let c = conversations[i];
              
              ft = c.From+c.To;

              if ( stories[ft] == null )
              {
                  stories[ft]={}
                  stories[ft]["A"] = c.From
                  stories[ft]["B"] = c.To
                  stories[ft]["Dial"] =[]
              }
              if ( c.From == stories[ft]["A"] && c.To ==  stories[ft]["B"])
                stories[ft]["Dial"].push([">>",c.Date,c.Subject])
              else if ( c.From == stories[ft]["B"] && c.To ==  stories[ft]["A"])
                 stories[ft]["Dial"].push(["<<",c.Date,c.Subject])
          }

          let ii=0;

          Logger.log(stories);
        }
      /*
              "name": "Subject",
        "value": "Re: Message 1"
      },
      {
        "name": "From",
        "value": "Gianfranco \u003cgianfranco.oldani@gmail.com\u003e"
      },
      {
        "name": "To",
        "value": "Gianfranco Oldani \u003cgf_oldani@hotmail.com\u003e"
      },
    */
    }
    else {
      // This is only needed when muteHttpExceptions == true
      Logger.log(resp1.getContentText()); 
      //var err = JSON.parse(resp1.getContentText());
      //throw new Error( 'Error (' + result + ") " + err.error.message );
    }
}