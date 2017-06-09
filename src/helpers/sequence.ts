import { AnimationOptions } from '../types'
import { Timeline } from '../core'

export const sequence = (seqOptions: AnimationOptions[]) => {
  const timeline = new Timeline()
  for (let i = 0, ilen = seqOptions.length; i < ilen; i++) {
    timeline.append(seqOptions[i])
  }
  return timeline
}
