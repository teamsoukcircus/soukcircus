/*======================= GMAIL CREDENTIALS FOR SOUKCIRCUS.@GMAIL.COM====================*/

const GOOGLE_CLIENT_ID       = '733992189679-tpr1hdr53gsbdavbtbbavq54bm9hd0np.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET   = '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';

const GOOGLE_REDIRECT_URI    = 'https://developers.google.com/oauthplayground';
//const GM_REDIRECT_URI    = 'https://script.google.com/macros/d/1wYd0ieG3i6IEJDIhEtYwfVx0IPjEV6PcOod1IvVAlxObLlw1BhsQcf7q/usercallback';
const GOOGLE_TOKEN_URL      = 'https://www.googleapis.com/oauth2/v4/token';
//const GM_REFRESH_TOKEN  = '1//04klYpaVeWJZkCgYIARAAGAQSNwF-L9Irni6vt8HkpgFr4EThqtJoJmPlls1wYCfS-ZyO8Rot-PHJ44aMghfUhAM0az7GybImll0';






function storeOAuthValues_(response){
  var tokenResponse = JSON.parse(response);

  var accessToken = tokenResponse.access_token;
  // expires_in is in seconds and Date.now is ms
  var endMs = Date.now() + tokenResponse.expires_in * 1000;
  var refreshToken = tokenResponse.refresh_token;


  //store the token for later retrival
  UserProperties.setProperty(oauthTokenPropertyName, accessToken);
  if (refreshToken) { //on a refresh call we wont get a new refresh token, lets not wipe prev one out
    UserProperties.setProperty(refreshTokenPropertyName, refreshToken);
  }
  UserProperties.setProperty(oauthTokenExpiresPropertyName, endMs);
}