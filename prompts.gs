function showInputPrompt(textPrompt) 
{
    let ui = SpreadsheetApp.getUi();
  
    let input = ui.prompt(textPrompt);

    return input.getResponseText();
}

function alert(text)
{
  SpreadsheetApp.getUi().alert(text);
}
