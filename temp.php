SELECT * from filestobesigned where userId=".$_SESSION['aa_user']." and revisionId=0
Union SELECT * from filestobesigned where revisionId in (SELECT aa from filestobesigned where userId=".$_SESSION['aa_user']." 
and revisionId=0)  order by date asc ;
