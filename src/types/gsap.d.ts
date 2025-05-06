declare module 'gsap' {
  export interface GSAPStatic {
    to: (target: any, vars: any) => any;
    from: (target: any, vars: any) => any;
    fromTo: (target: any, fromVars: any, toVars: any) => any;
    set: (target: any, vars: any) => any;
    timeline: (vars?: any) => any;
    registerPlugin: (...args: any[]) => void;
  }

  const gsap: GSAPStatic;
  export default gsap;
}

declare module 'gsap/SplitText' {
  export class SplitText {
    constructor(target: any, vars?: any);
    chars: any[];
    words: any[];
    lines: any[];
    revert: () => void;
  }
}
