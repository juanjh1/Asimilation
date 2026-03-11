import { DecoratorPrivateAccessError } from '../../exceptions/basics/bound.error';

export function bound(fn: Function, _ctx: ClassMethodDecoratorContext){
  if (_ctx.private) throw new DecoratorPrivateAccessError();
  _ctx.addInitializer( function () {
      (this as {[key: string]: any})[String(_ctx.name)] = fn.bind(this);
  })
}
