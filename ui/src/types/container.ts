export interface Container {
  id: string;
  name: string;
  displayName: string;
  displayIcon: string;
  watcher: string;
  updateAvailable: boolean;
  updateKind: {
    kind: string;
    semverDiff?: string;
    remoteValue: string;
    localValue?: string;
  };
  image: {
    registry: {
      name: string;
    };
    tag: {
      value: string;
      semver: boolean;
    };
    created: string;
    os: string;
  };
  result?: {
    created?: string;
  };
  error?: string;
  labels?: Record<string, string>;
}
