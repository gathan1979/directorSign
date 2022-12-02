		<nav class="navbar navbar-default" style="background-color:#cbead2">
			<div class="container-fluid">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					  </button>
					 </a>
				</div>
	
				 <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<ul class="nav navbar-nav">
						<li id="prosIpografi"  text-center"><a href="../../directorSign"><span class="label label-warning">Προς Υπογραφή</span></br></br><i class="far fa-file fa-lg"></i></a></li>
						<li id="ipogegrammena"  text-center"><a href="../../directorSign/signed.php"><span class="label label-success">Διεκπεραιωμένα</span></br></br><i class="far fa-file-pdf fa-lg"></i></a></li>
						<script type="text/javascript" defer>
							
							//Πρόσβαση στο Παρουσιολόγιο
							//if (+JSON.parse(localStorage.getItem("loginData")).user.privilege){
								const adeiesBtn = '<li class="text-center"><a target="_blank" href="/adeies/index.php"><span class="label label-info">Άδειες</span></br></br><i class="far fa-calendar-alt  fa-lg"></i></a></li>';
							//}
							document.querySelector("#bs-example-navbar-collapse-1>ul").innerHTML += adeiesBtn;
						</script>
							
						<li class="text-center"><a target="_blank" rel="opener" href="../nocc-1.9.8/protocol/editTable1.php?tn=book"><span id="protocolAppText" class="label label-primary"></span></br></br><i class="fas fa-book fa-lg"></i></a></li>
						<script type="text/javascript" defer>
							const loginData = localStorage.getItem("loginData")?JSON.parse(localStorage.getItem("loginData")):alert('Δεν υπάρχουν δεδομένα χρήστη');
							//Πρόσβαση στο Πρωτόκολλο λεκτικό
							let cRole = localStorage.getItem("currentRole");
							if (+loginData.user.roles[cRole].protocolAccessLevel){
								document.querySelector("#protocolAppText").textContent = "Διαχειριστής";
							}
							else{
								document.querySelector("#protocolAppText").textContent = "Χρεώσεις Μου";
							}
							
						</script>	

						
						<li class="text-center"><a target="_blank" href="../nocc-1.9.8/protocol/protocolBook.php?tn=book"><span class="label label-primary">
						Πρωτόκολλο</span></br></br><i class="fab fa-readme fa-lg"></i></a></li>
						
						<div style="display:none;">
							<form name="heskForm" id="heskForm" action="../hesk/admin/index.php" method="post"  target="_blank">
							  <input type="text" name="user" id="user" value="<?php echo $_SESSION['aa_user'] ?>"></input>
							  <input type="text" name="pass" id="pass" value="1Q2w3e$"></input>
							  <input type="text" name="remember_user" id="remember_user" value="NOTHANKS"></input>
							  <input type="text" name="a" id="a" value="do_login"></input>
							  <input type="submit"  value="Submit form">
							</form>
						</div>

						<li id="minimata" class="text-center"><a href="/messages.php"><span class="label label-success">Μηνύματα</span></br></br><i class="fas fa-envelope-open fa-lg"></i><span class="badge badge-warning"></span></a></li>

						<li class="text-center" id="rithmiseis" ><a href="/settings.php"><span class="label label-danger">Ρυθμίσεις</span></br></br><i class="fas fa-cog fa-lg"></i></a></li>

						
						<li class="text-center"><div class="dropdown" style="padding-top:20px">
							<button class="btn btn-success dropdown-toggle" data-toggle="dropdown">

							<span class="caret"></span></button>
									
							<ul class="dropdown-menu">
								<li><b style="margin-left:0.5em;" id="connectedUser"><span></span></b></li>
								<ul style="margin:1em; list-style-type: none;" id="userRoles"></ul>

							<script type="text/javascript" defer>
								loginData.user.roles.forEach((role,index)=>{
									let newRole;
									if(index == cRole){
										newRole = '<li style="margin-top:2px;"><button type="button" class="btn btn-success btn-sm">'+role.roleName+'</btn></li>';
									}
									else{
										newRole = '<li style="margin-top:2px;"><button type="button" class="btn btn-info btn-sm">'+role.roleName+'</btn></li>';
									}
									//console.log(newRole);
									document.querySelector("#userRoles").innerHTML += newRole;
									return;
								});
								document.querySelector("#connectedUser>span").textContent = loginData.user.user;
							
							</script>
							
								<li role="separator" class="divider"></li>
								<li><a id="changePwdBtn">Αλλαγή Κωδικού</a></li>
								<li role="separator" class="divider"></li>
								<li id="aposindesiEfarmogis"><div style="padding-left:20px;" class="dropdownMenuDiv"><button onclick="logout();" class="btn-danger btn-sm" id="logoutBtn">Αποσύνδεση</button></div></li>
							</ul></div></li>
							
							<script type="text/javascript" defer>
								const aaStaff = loginData.user.aa_staff;
								const aaUser = loginData.user.aa_user;
								document.querySelector("#changePwdBtn").href = "changePasswordForm.php?aa="+aaStaff+"&aaP="+aaUser;
							</script>
					</ul>
				</div><!-- /.navbar-collapse -->
			</div><!-- /.container-fluid -->
		</nav>