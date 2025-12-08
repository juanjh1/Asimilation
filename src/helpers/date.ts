
export function timeTakedToResolve ( initialDate:Date, finalDate: Date) : number{	
	return finalDate.getTime() - initialDate.getTime()
}
