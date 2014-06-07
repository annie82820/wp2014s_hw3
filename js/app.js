(function(){
	//Parse initialization
	Parse.initialize("3Q0fl5PFmawluhNowBEogxyOlhLFIp2YTS5s5TBy", "HWWfH7Aa4E0CXz5IS0WAlQxCUMVVlbkdiEBQL7lV");
	
	//Compile template engine function
	var compiled = {};
	var views = ["loginView", "evaluationView", "updateSuccessView"];
	for(var i = 0;i < views.length;i++){
			var view_text = document.getElementById(views[i]).text;
			compiled[views[i]] = doT.template(view_text);
	}

	//Shared function
			
	var handler = {
		navbar: function(){
			var users = Parse.User.current();
			var loginButton = $("#loginButton");
			var evaluationButton = $("#evaluationButton");
			var logoutButton = $("#logoutButton");
			if(users==null){
				loginButton.css("display", "block");
				evaluationButton.css("display", "none");
				logoutButton.css("display", "none");
			}
			else{
				loginButton.css("display", "none");
				evaluationButton.css("display", "block");
				logoutButton.css("display", "block");
			}
			
			logoutButton.click(function(){
				Parse.User.logOut();
				loginButton.css("display", "block");
				evaluationButton.css("display", "none");
				logoutButton.css("display", "none");
				window.location = "?#login/";
			});
		},
		loginView: function(){
			//Show the login content on browser
			var content = document.getElementById("content");
			content.innerHTML = compiled["loginView"]();
			
			//check if student ID has been entered in login form
			document.getElementById("form-signin-student-id").addEventListener("keyup", function(){
				var loginStudentID = this.value;
				if(TAHelp.getMemberlistOf(loginStudentID)==false){
					document.getElementById("form-signin-message").style.display = "block";
					document.getElementById("form-signin-message").innerHTML = "<p>The student is not one of the class students.</p>"
				}
				else{
					document.getElementById("form-signin-message").style.display = "none";
				}
			});
			
			//check if student ID has been entered in sign up form
			document.getElementById("form-signup-student-id").addEventListener("keyup", function(){
				var signupStudentID = this.value;
				if(TAHelp.getMemberlistOf(signupStudentID)==false){
					document.getElementById("form-signup-message").style.display = "block";
					document.getElementById("form-signup-message").innerHTML = "<p>The student is not one of the class students.</p>"
				}
				else{
					document.getElementById("form-signup-message").style.display = "none";
				}
			});
			
			//check password correctness in sign up form
			document.getElementById("form-signup-password1").addEventListener("keyup", function(){
				var signupPwd = document.getElementById("form-signup-password").value;
				var signupPwdRepeat = this.value;
				if(signupPwd != signupPwdRepeat){
					document.getElementById("form-signup-message").style.display = "block";
					document.getElementById("form-signup-message").innerHTML = "<p>Passwords don't match.</p>"
				}
				else{
					document.getElementById("form-signup-message").style.display = "none";
				}	
			});
			
			//check if student ID and password is correct in log in form
			document.getElementById('form-signin').addEventListener('submit', function(){
				Parse.User.logIn(
					document.getElementById('form-signin-student-id').value,
					document.getElementById('form-signin-password').value, 
					{
						success: function(user) {
							handler.navbar();
							window.location = "?#peer-evaluation/";
						}, 
						error: function(user, error) {
							alert("Error:" + error.code + " " + error.message);
							window.location = "?#login/";
						}
					}
				);
			});
			
			//check if student ID and password is correct in sign up form
			document.getElementById('form-signup').addEventListener('submit', function(){
				var user = new Parse.User();
				user.set("username", document.getElementById("form-signup-student-id").value);
				user.set("password", document.getElementById("form-signup-password").value);
				user.set("email", document.getElementById("form-signup-email").value);
				
				user.signUp(null, {
					success: function(user){
						handler.navbar();
						window.location = "?#peer-evaluation/";
					},
					error: function(user, error){
						alert("Error:" + error.code + " " + error.message);
						window.location = "?#login/";
					}
				});
			});
		},
		evaluationView: function(){
			var evaluation = Parse.Object.extend("Evaluation");
			var query = new Parse.Query(evaluation);
			query.first({
				success: function(data){
					var current_user = Parse.User.current();
					var member = TAHelp.getMemberlistOf(current_user.getUsername());
						
					for(var i = 0;i < member.length;i++){
						if(data === undefined){
							member[i]["scores"] = new Array("0", "0", "0", "0");
						}
						else{
							member = data.get("evaluation").slice(0);
							break;
						}
						if(member[i].StudentId===current_user.getUsername()){
							member.splice(i, 1);
							i--;
						}
						
					}
					
					document.getElementById("content").innerHTML = (compiled.evaluationView(member));
					for(var i = 0;i < 4;i++){
						for(var j = 0;j < 3;j++){
							$("stu"+member.StudentId+"-q"+j.toString()).val(member[i].scores[j]);
						}
					}
					document.getElementById('evaluationForm').addEventListener('submit', function(){
						for(var i = 0;i < member.length;i++){
							var total = 0;
							for(var j = 0;j < 4; j++){
								var tmp_score = $("#stu"+member[i]["StudentId"]+"-q"+j.toString()).val();
								member[i]["scores"][j] = tmp_score; 
							}
						}
						var changed = new evaluation();
						changed.set("user",Parse.User.current());
						changed.set("evaluation",data.get("evaluation").slice(0));
						if(originData === undefined){
							changed.save(null, {
								success: function(changed){
									console.log("New row added!!");
									document.getElementById("content").innerHTML = (compiled.updateSuccessView());
								},
								error: function(changed, error){
									alert("Error:" + error.code + " " + error.message);
								}
							});
						}
						else{
							changed.save(null, {
								success: function(changed){
									changed.set("evaluation", member);
									changed.save();
									console.log("Data changed.");
									document.getElementById("content").innerHTML = (compiled.updateSuccessView());
								}
							});
						}	
					});
				},
				error: function(data, error){
					alert("Error:" + error.code + " " + error.message);
				}
			});
		}
	};
	
var s=function(){
		n.navbar();
		window.location.hash=t?t:""
	};
	var o=function(){
		var e=document.getElementById("form-signup-password");
		var t=document.getElementById("form-signup-password1");
		var n=e.value===t.value?true:false;
		i("form-signup-message",function(){
			return n
		},"Passwords don't match.");
		return n
	};
	document.getElementById("content").innerHTML=e.loginView();
	document.getElementById("form-signin-student-id").addEventListener("keyup",function(){
		i("form-signin-message",function(){
			return r("form-signin-student-id")
		},"The student is not one of the class students.")
	});
	document.getElementById("form-signin").addEventListener("submit",function(){
		if(!r("form-signin-student-id")){
			alert("The student is not one of the class students.");
			return false
		}
		Parse.User.logIn(document.getElementById("form-signin-student-id").value,document.getElementById("form-signin-password").value,
			{success:function(e){
				s()
			},error:function(e,t){
				i("form-signin-message",function(){
					return false
				},"Invaild username or password.")
			}})},false);
	document.getElementById("form-signup-student-id").addEventListener("keyup",function(){
		i("form-signup-message",function(){
			return r("form-signup-student-id")
		},"The student is not one of the class students.")});
	document.getElementById("form-signup-password1").addEventListener("keyup",o);
	document.getElementById("form-signup").addEventListener("submit",function(){
		if(!r("form-signup-student-id")){
			alert("The student is not one of the class students.");
			return false
		}
		var e=o();
		if(!e){
			return false
		}
		var t=new Parse.User;
		t.set("username",document.getElementById("form-signup-student-id").value);
		t.set("password",document.getElementById("form-signup-password").value);
		t.set("email",document.getElementById("form-signup-email").value);
		t.signUp(null,
			{success:function(e){
				s()
			},error:function(e,t){
				i("form-signup-message",function(){
					return false
				},t.message)}})},false)}};
	var r=Parse.Router.extend({
		routes:{
			"":"indexView",
			"peer-evaluation/":"evaluationView",
			"login/*redirect":"loginView"
		},
		indexView:n.evaluationView,
		evaluationView:n.evaluationView,
		loginView:n.loginView
	});
	
	this.Router=new r;
	Parse.history.start();
	n.navbar()
})()
