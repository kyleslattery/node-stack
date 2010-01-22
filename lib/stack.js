exports.Stack = function() {
	var stack = this;
	
	stack.layers = [];
	stack.endpoint = null;
	
	// A new one of these gets created for each request, and it keeps track of
	// which layer the stack is currently on.
	stack.Runner = function() {
		var runner = this;
		var currentLayer = 0;
		
		runner.start = function(request, response) {
			
		}
		
		runner.request = function(request, callback) {
			
		}
		
		runner.respond = function(response) {
			
		}
	}
	
	// Add layer
	stack.add = function(layer) {
		stack.layers.push(layer);
	}
	
	// Set Endpoint
	stack.setEndpoint = function(endpoint) {
		stack.endpoint = endpoint;
	}
	
	// Run the stack for a request
	stack.run = function(request, response) {
		var runner = new stack.Runner();
		runner.start(request,response);
	}
}