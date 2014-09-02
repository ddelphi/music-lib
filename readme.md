
#music lib - readme

##overview

This is a simple nodejs script for music lib.

It is only the backend script, all actions are performed by http POST method, and will return result with JSON format.
	
##usage

Because I don't think anyone will use this to do some cool things, so I just introduce the structure of the script, then you can build your own one.
	
##structure

There are some key point from the very beginning to the end in the whole running process:
	
	* param from client
	* session
	* router
	* controller
		* check acl
		* deal with data
		* render

####param from client

This process is for getting all necessary param from client for convenience.

The param can be a url and its query, http POST query, cookie, ect.


####session

This process is for dealing the infomation of users. For a login user, the session object will contain the user's info. For a guest user, it wil not has any infomation about user.

If you want to make the user infomation consistent in the session object, you should do some effort to deal with the situation for guest user.


####router

This process is for routing the http method and url to the specified controller.


####controller

This process is the core of the script.

The controller object just like a manager, who will manage all the logic of the data processing.

The main logic in the controller will be:

	* check 'access control list'
	* passing the query param and data to data manager object
	* render the result

the 'access control list' (acl) is for prevent some group of users to do some action. For example, the guest user can not do the create action, the acl step can help you to prevent it.

The 'data manger object' will accept the query param and data, then verify them, finally connect to database and do the work that ask from the query param.

When receive the result from 'data manager object', the controller can do some work to the result, then pass it to the view object.

The view object will render the page with the result.

