import { Options, RepoBackend } from './RepoBackend'
import { RepoFrontend } from './RepoFrontend'
import { Handle } from './Handle'
import { PublicMetadata } from './Metadata'
import { Clock } from './Clock'
import { DocUrl, HyperfileUrl } from './Misc'
import FileServerClient from './FileServerClient'
import { Swarm } from './Network'

export class Repo {
  front: RepoFrontend
  back: RepoBackend
  id: Buffer
  stream: (opts: any) => any
  create: <T>(init?: T) => DocUrl
  open: <T>(id: DocUrl) => Handle<T>
  destroy: (id: DocUrl) => void
  //follow: (id: string, target: string) => void;
  setSwarm: (swarm: Swarm) => void
  startFileServer: (fileServerPath: string) => void

  message: (url: DocUrl, message: any) => void

  fork: (url: DocUrl) => DocUrl
  watch: <T>(url: DocUrl, cb: (val: T, clock?: Clock, index?: number) => void) => Handle<T>
  doc: <T>(url: DocUrl, cb?: (val: T, clock?: Clock) => void) => Promise<T>
  merge: (url: DocUrl, target: DocUrl) => void
  change: <T>(url: DocUrl, fn: (state: T) => void) => void
  files: FileServerClient
  materialize: <T>(url: DocUrl, seq: number, cb: (val: T) => void) => void
  meta: (url: DocUrl | HyperfileUrl, cb: (meta: PublicMetadata | undefined) => void) => void
  close: () => void

  constructor(opts: Options) {
    this.back = new RepoBackend(opts)
    this.front = new RepoFrontend()
    this.front.subscribe(this.back.receive)
    this.back.subscribe(this.front.receive)
    this.id = this.back.id
    this.stream = this.back.stream
    this.create = this.front.create
    this.open = this.front.open
    this.message = this.front.message
    this.destroy = this.front.destroy
    this.meta = this.front.meta
    //    this.follow = this.front.follow;
    this.doc = this.front.doc
    this.fork = this.front.fork
    this.close = this.front.close
    this.change = this.front.change
    this.files = this.front.files
    this.watch = this.front.watch
    this.merge = this.front.merge
    this.setSwarm = this.back.setSwarm
    this.startFileServer = this.back.startFileServer
    this.materialize = this.front.materialize
  }
}
