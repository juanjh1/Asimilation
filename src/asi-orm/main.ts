export function entity (name?: string):Function{

	return function <T extends new (...args: any[]) => {}>(constructor: T){
		
		let tableName: string; 
		
		if (name == null){
			tableName = constructor.name
		}else{
			tableName = name
		}
	}
}

