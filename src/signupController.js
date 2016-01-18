function signupController ($state, authService)
{
    var vm = this;
    var roles = {};
    roles.USER = 1 << 1;
    roles.SPONSOR = 1 << 2; 
    vm.roles = roles;

    vm.role = "user";
    vm.email = "";
    vm.password = "";
    vm.name = "";

    vm.signup = signup;
    vm.beUser = beUser;
    vm.beSponsor = beSponsor;

    function beUser()
    {
        vm.role = "user";
        console.log(vm.role);
    }

    function beSponsor ()
    {
        vm.role = "sponsor";
        console.log(vm.role);
    }

    function redirectHome ()
    {
        $state.go("home");
    }

    function signup ()
    {
        var account = {
            email: vm.email,
            password: vm.password,
            role: vm.role
        };

        if (vm.role === "user") {
            account.profile = {
                name: vm.name,
                school: vm.school
            };
        } else {
            account.profile = {
                name: vm.name,
                company: vm.company
            };
        }

        authService.createAccount(account)
            .then(redirectHome)
            .catch(err => {
                console.log(err);
            });

    }
}

module.exports = signupController;
