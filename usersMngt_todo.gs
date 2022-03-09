//========================
// TODO
//========================
const userProto =
{
  email:"", //this is the user Id
  firstname:"",
  lastname:"",
  annualSalary:0
};


function createUser() {
  
}

function deleteUser()
{

}

function updateUser()
{

}

function suspendUser(userId)
{

}

function readUser(userId)
{

}

function getAllUsers()
{
   return utils_getSheet(WORKERS_SHEET).getDataRange().getValues();
}
