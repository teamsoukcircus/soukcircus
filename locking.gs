function lock_acquire() 
{
  var lock = LockService.getScriptLock();

  try 
  {
      lock.waitLock(15000); // wait 15 seconds for others' use of the code section and lock to stop and then proceed
  } 
  catch (e) 
  {
      errors_logErrorAndEmail('Could not obtain lock after 15 seconds.');
      throw new Error("Syytem busy, merci d'essayer dans quelques instants...")
  }

  return lock;
}

function lock_release(theAcquiredLock)
{
    theAcquiredLock.releaseLock();
}


