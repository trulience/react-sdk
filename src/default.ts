import {
  EventCallbacks,
  TrulienceClass,
  TrulienceObject,
  VideoElements,
} from './types';

interface InitDetails {
  avatarId?: string;
  token?: string | null;
  username?: string;
  dhType?: any; // This should be from TrulienceSDK.DigitalHumanType enum
  retry?: boolean;
  videoElements?: VideoElements;
  envParams?: Record<string, any>;
  avatarParams?: Record<string, any>;
  eventCallbacks?: EventCallbacks;
}

type InitStateValue =
  (typeof TrulienceSDK.InitState)[keyof typeof TrulienceSDK.InitState];

class TrulienceSDK {
  static readonly InitState = {
    NOT_INITIATED: 0,
    IN_PROGRESS: 1,
    COMPLETED: 2,
    FAILED: 3,
  } as const;

  // Type for InitState values

  // Private static variables
  static #trulienceClass: TrulienceClass | null = null;
  static #libraryLoadPromise: Promise<TrulienceClass> | null = null;
  static #libraryLoaded: boolean = false;

  // Instance variables
  #initState: InitStateValue = TrulienceSDK.InitState.NOT_INITIATED;

  // Enums - these will be populated after library loads
  static TGStatus: Record<string, any> | null = null;
  static AvatarStatus: Record<string, any> | null = null;
  static MessageType: Record<string, any> | null = null;
  static CallEndReason: Record<string, any> | null = null;
  static DigitalHumanType: Record<string, any> | null = null;

  constructor() {}

  // Private Methods
  static #loadScript(url: string, idVal: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const script: HTMLScriptElement = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.id = idVal;

      // Resolve the promise when the script is loaded successfully
      script.onload = (): void => {
        resolve();
      };

      // Reject the promise if the script fails to load
      script.onerror = (): void => {
        reject(new Error(`Failed to load script: ${url}`));
      };

      // Append the script to the document head or body
      document.head.appendChild(script);
    });
  }

  static #loadTrulienceLibrary(url: string): Promise<TrulienceClass> {
    // If the library has already been loaded, return the resolved promise
    if (TrulienceSDK.#libraryLoaded && TrulienceSDK.#trulienceClass) {
      console.log(
        'Ignoring Trulience library load request because already loaded.'
      );
      return Promise.resolve(TrulienceSDK.#trulienceClass);
    }

    // If the library is already being loaded, return the existing promise
    if (TrulienceSDK.#libraryLoadPromise) {
      return TrulienceSDK.#libraryLoadPromise;
    }

    // Otherwise, start loading the library and store the promise
    TrulienceSDK.#libraryLoadPromise = new Promise<TrulienceClass>(
      (resolve, reject) => {
        if (TrulienceSDK.#trulienceClass) {
          TrulienceSDK.#libraryLoaded = true;
          resolve(TrulienceSDK.#trulienceClass);
          return;
        }

        TrulienceSDK.#loadScript(url, 'trulience-sdk-script')
          .then((): void => {
            TrulienceSDK.#trulienceClass = window.Trulience; // Assuming the library attaches itself to the window object
            if (!TrulienceSDK.#trulienceClass) {
              console.error('Trulience class not found on window object');
              reject(new Error('Trulience class not found'));
              return;
            }

            console.log('Trulience class loaded successfully');
            TrulienceSDK.#libraryLoaded = true;
            resolve(TrulienceSDK.#trulienceClass);
          })
          .catch((err: Error): void => {
            console.error('Error loading Trulience library:', err);
            reject(err);
            return;
          });
      }
    );

    return TrulienceSDK.#libraryLoadPromise;
  }

  #setupEnums(Trulience: TrulienceClass): void {
    TrulienceSDK.MessageType = Trulience.MessageType;
    TrulienceSDK.CallEndReason = Trulience.CallEndReason;
    TrulienceSDK.AvatarStatus = Trulience.AvatarStatus;
    TrulienceSDK.DigitalHumanType = Trulience.DigitalHumanType;
    TrulienceSDK.TGStatus = Trulience.TGStatus;
  }

  // Public Methods
  public initSDK(url: string, details: InitDetails): Promise<TrulienceObject> {
    return new Promise<TrulienceObject>((resolve, reject) => {
      if (this.#initState === TrulienceSDK.InitState.IN_PROGRESS) {
        console.log(
          'Ignoring initializeTrulienceSDK because already in progress'
        );
        reject(new Error('Already in Progress'));
        return;
      }

      this.#initState = TrulienceSDK.InitState.IN_PROGRESS;

      // get overriden url from url param if provided
      const urlParams: URLSearchParams = new URLSearchParams(
        window.location.search
      );
      const param: string | null = urlParams.get('TRULIENCE_SDK_URL');
      if (param) {
        url = param;
        console.warn('LOADING OVERRIDE SDK URL', url);
      }

      TrulienceSDK.#loadTrulienceLibrary(url)
        .then((Trulience: TrulienceClass): void => {
          this.#setupEnums(Trulience);

          // If dhType is not provided, default is CUSTOM dh type.
          const dhType: any = details.dhType
            ? details.dhType
            : Trulience.DigitalHumanType.CUSTOM;
          const enableAvatar: boolean =
            dhType === Trulience.DigitalHumanType.WEBGL ? false : true;

          // Create the object to work with if initialized.
          const trulienceObj: TrulienceObject = Trulience.Builder()
            .setAvatarId(details.avatarId ?? '')
            .setToken(details.token ?? null)
            .setUserName(details.username ?? 'Guest')
            .enableAvatar(enableAvatar)
            .setRetry(details.retry ?? false)
            .registerVideoElements(details.videoElements ?? null)
            .setEnvParams(details.envParams ?? {})
            .setAvatarParams(details.avatarParams ?? {})
            .build();

          // Set the notification listeners
          if (details.eventCallbacks) {
            Object.entries(details.eventCallbacks).forEach(
              ([key, value]: [string, (...args: any[]) => void]): void => {
                trulienceObj.on(key, value);
              }
            );
          }
          this.#initState = TrulienceSDK.InitState.COMPLETED;
          resolve(trulienceObj);
        })
        .catch((error: Error): void => {
          console.error('error in initSDK - ', error);
          this.#initState = TrulienceSDK.InitState.FAILED;
          reject(error);
        });
    });
  }

  public isInitialized(): boolean {
    return this.#initState === TrulienceSDK.InitState.COMPLETED;
  }
}

export default TrulienceSDK;
