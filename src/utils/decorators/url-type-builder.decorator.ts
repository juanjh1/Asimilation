//just a example -- i need role back wen need implement a
// decorator
// referece -> https://2ality.com/archive.html
export function assingType<This, Args extends any[], Return>(
	fn: Function,
	_ctx: ClassMethodDecoratorContext<
		This,
		(this: This, ...args: Args) => Return
	>,
) {
	return function wrapper(this: This, ...args: Args): Return {
		console.log(`class method mame `);
		return fn.call(this, ...args);
	};
}
