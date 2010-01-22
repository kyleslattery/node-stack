var sys = require("sys");

exports.Stack = function() {
	var stack = this;
	
	stack.layers = [];
	stack.endpoint = null;
	
	// A new one of these gets created for each request, and it keeps track of
	// which layer the stack is currently on.
	stack.Runner = function() {
		var runner = this;

		runner.currentLayerIndex = -1;
		runner.callbackStack     = [];
		
		runner.start = function(request, httpResponse) {
			runner.request(request, function(response) {
				httpResponse.sendHeader(response.statusCode, response.headers);
				httpResponse.sendBody(response.body);
				httpResponse.finish();
			});
		}
		
		runner.request = function(request, callback) {
			// Add callback to stack
			runner.callbackStack.push(callback);
			
			// Check if there are still stacks to run
			if(runner.currentLayerIndex + 1 < stack.layers.length) {
				// Increase current index
				runner.currentLayerIndex += 1;
			
				// Call layer
				sys.puts("Calling Layer #" + runner.currentLayerIndex);
				stack.layers[runner.currentLayerIndex](runner, request);
			} else {
				// No more layers to run, so call the endpoint
				stack.endpoint(runner, request);
			}
		}
		
		runner.respond = function(response) {
			// Retrieve last callback added
			var callback = runner.callbackStack.pop();
			
			// Call the callback with the response
			callback(response);
		}
	}
	
	// Add layer
	stack.add = function(layer) {
		sys.puts("Added layer: " + layer.toString());
		stack.layers.push(layer);
		sys.puts("Layers: " + stack.layers.length);
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