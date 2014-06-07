(function(){

//Parse initialization
	Parse.initialize("60ud03N7lNt4Eke13GPYxxjfJalEXyxzG8HvQdgz", "iAqPxovNSsMcSNZWQcTEB3TeWW5z7ynP3quQ3Vr2");

	//編譯template engine函數();
	var a = ["loginView", "evaluationView", "updateSuccessView"];
    var c = {};
    for (var i=0;i<a.length;i+=1){
		var b = $("script#"+a[i]).html();
		c[a[i]]= doT.template(b);
    }
    
	var handler = {
		navbar: function(){
			var currentUser = Parse.User.current();
			if (currentUser) {
				// do stuff with the user
				$("#loginButton").css("display","none");
				$("#logoutButton").css("display","block");
				$("#evaluationButton").css("display","block");
			} else {
				// show the signup or login page
				$("#loginButton").css("display","block");
				$("#logoutButton").css("display","none");
				$("#evaluationButton").css("display","none");
			}
           
            $("#logoutButton").click(function(){
            	$("#loginButton").css("display","block");
				$("#logoutButton").css("display","none");
				$("#evaluationButton").css("display","none");
            });
		},

		loginView: function(){
			//Show the login content on browser
			$("#content").html(c['loginView']);	
		
			//check if student ID has been entered in login form
			$("#form-signin-student-id").keyup(function(){
				var  ID = $("#form-signin-student-id").val();
				if (TAHelp.getMemberlistOf(ID) === false ){
					$("#form-signin-message").css("display","block");
					$("#form-signin-message").html("The student is not one of the class students.");
				}	
				else{
					$("#form-signin-message").css("display","none");
				}
			});

			$("#form-signup-student-id").keyup(function(){
				var  ID = $("#form-signup-student-id").val();
				if (TAHelp.getMemberlistOf(ID) === false ){
					$("#form-signup-message").css("display","block");
					$("#form-signup-message").html("The student is not one of the class students.");
				}	
				else{
					$("#form-signup-message").css("display","none");
				}
			});

			$("#form-signup-password1").keyup(function(){
				var password = $("#form-signup-password").val();
				var password1 = $("#form-signup-password1").val();

				if (password != password1){
					$("#form-signup-message").css("display","block");
					$("#form-signup-message").html("Passwords don't match.");
				}
				else{
					$("#form-signup-message").css("display","none");
				}
			});

		    $("#form-signup").submit(function(){
		    	var user = new Parse.User();
				user.set("username",$("#form-signup-student-id").val());
				user.set("password",$("#form-signup-password").val());
				user.set("email",$("#form-signup-email").val());
				 
				user.signUp(null, {
					success: function(user) {
				    	// Hooray! Let them use the app now.
				    	handler.navbar();
				    	window.location = "?#peer-evaluation/";
					},
					error: function(user, error) {
				    	// Show the error message somewhere and let the user try again.
		     			alert("Error: " + error.code + " " + error.message);
						window.location = "?#login/";
					}
				});
		    });
		    $("#form-signin").submit(function(){
		    	Parse.User.logIn($("#form-signin-student-id").val(), $("#form-signup-password").val(), {
  					success: function(user) {
  						handler.navbar();
  						window.location = "?#peer-evaluation/";

  					},
  					error: function(user, error) {
  						alert("Error: " + error.code + " " + error.message);
  						window.location = "?#login/";
 					}
 				});
			});
		}


var n={
		navbar:function(){
			var e=Parse.User.current();
			if(e){
				document.getElementById("loginButton").style.display="none";
				document.getElementById("logoutButton").style.display="block";
				document.getElementById("evaluationButton").style.display="block"
			}else{
				document.getElementById("loginButton").style.display="block";
				document.getElementById("logoutButton").style.display="none";
				document.getElementById("evaluationButton").style.display="none"
			}
			document.getElementById("logoutButton").addEventListener("click",function(){
				Parse.User.logOut();
				n.navbar();
				window.location.hash="login/"
			})
		},
		evaluationView:t.loginRequiredView(function(){
			var t=Parse.Object.extend("Evaluation");
			var n=Parse.User.current();
			var r=new Parse.ACL;
			r.setPublicReadAccess(false);
			r.setPublicWriteAccess(false);
			r.setReadAccess(n,true);
			r.setWriteAccess(n,true);
			var i=new Parse.Query(t);
			i.equalTo("user",n);
			i.first(
				{success:function(i){
					window.EVAL=i;
					if(i===undefined){
						var s=TAHelp.getMemberlistOf(n.get("username")).filter(function(e){
							return e.StudentId!==n.get("username")?true:false
						}).map(function(e){
							e.scores=["0","0","0","0"];
							return e})
					}else{
						var s=i.toJSON().evaluations
					}
					document.getElementById("content").innerHTML=e.evaluationView(s);
					document.getElementById("evaluationForm-submit").value=i===undefined?"送出表單":"修改表單";
					document.getElementById("evaluationForm").addEventListener("submit",function(){
						for(var o=0;o<s.length;o++){
							for(var u=0;u<s[o].scores.length;u++){
								var a=document.getElementById("stu"+s[o].StudentId+"-q"+u);
								var f=a.options[a.selectedIndex].value;
								s[o].scores[u]=f
							}
						}
						if(i===undefined){
							i=new t;
							i.set("user",n);
							i.setACL(r)
						}
						console.log(s);
						i.set("evaluations",s);
						i.save(null,
							{success:function(){
								document.getElementById("content").innerHTML=e.updateSuccessView()
							},error:function(){}})},false)
				},
				error:function(e,t){}})
		}),
		loginView:function(t){
			var r=function(e){
				var t=document.getElementById(e).value;
				return TAHelp.getMemberlistOf(t)===false?false:true};
				var i=function(e,t,n){if(!t()){
					document.getElementById(e).innerHTML=n;
					document.getElementById(e).style.display="block"
				}else{
					document.getElementById(e).style.display="none"
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

/*登入view函數: function(){
把版型印到瀏覽器上();s
綁定登入表單的學號檢查事件(); // 可以利用TAHelp物件
綁定註冊表單的學號檢查事件(); // 可以利用TAHelp物件
綁定註冊表單的密碼檢查事件(); // 參考上課範例
綁定登入表單的登入檢查事件(); // 送出還要再檢查一次，這裡會用Parse.User.logIn
綁定註冊表單的註冊檢查事件(); // 送出還要再檢查一次，這裡會用Parse.User.signUp和相關函數
},
評分view函數: function(){
// 基本上和上課範例購物車的函數很相似，這邊會用Parse DB
問看看Parse有沒有這個使用者之前提交過的peer review物件(
沒有的話: 從TAHelp生一個出來(加上scores: [‘0’, ‘0’, ‘0’, ‘0’]屬性存分數並把自己排除掉)
把peer review物件裡的東西透過版型印到瀏覽器上();
綁定表單送出的事件(); // 如果Parse沒有之前提交過的peer review物件，要自己new一個。或更新分數然後儲存。
);
},*/
};
	var Router = Parse.Router.extend({
		routes: {
		"": "loginView",
		"peer-evaluation/": "evaluationView",
		"login/*redirect": "loginView",
		},
		indexView: handler.evaluationView,
		evaluationView: handler.evaluationView,
		loginView: handler.loginView,
	});
	
	handler.navbar();
	this.Router = new Router();
	Parse.history.start();
	
})();
