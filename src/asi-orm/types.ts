interface TypeInterface{
	
}


abstract class AbstractType implements TypeInterface{

}

interface KwargsBase{
	nulable?:boolean,
	blank?:boolean,
	name?:string,
	unique?:boolean,
	primary?: boolean,
}


interface IntegerKwargs extends KwargsBase{
	min?: number
	max?: number
}

export class Integer extends AbstractType{
	constructor(kwargs: IntegerKwargs){
		super()
		let validatedProperties : { [key: string]: boolean|number|string} = {}

		for (const key in kwargs){
			if(key != undefined){
				//validatedProperties[key.toString()] = kwargs[key.toString()] 
			}
		}

		console.log(validatedProperties)
	}
}


