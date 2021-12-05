import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ModeStorage, MODE_STORAGE_SERVICE } from "./mode-storage.service";
import { Mode } from "./mode-toggle.model";

/**
 * Angular service that provides the mode toggle feature.
 * In summary this service adds the `class='light'` to the document.body element and
 * styles change based on the class added to the document.body
 *
 * Also provides a Observable that emits the current mode every time mode changes
 */
@Injectable()
export class ModeToggleService {
  /**
   * contains the current active mode
   * avoid mutating it directly, instead use `updateCurrentMode`
   */
  private currentMode: Mode = Mode.LIGHT;

  /**
   * BehaviorSubject that detects the mode changes
   */
  private modeChangedSubject = new BehaviorSubject(this.currentMode);

  /**
   * Observable that emits the current mode when mode changes.
   * Exposed publicly so that other components can use this feature
   */
  modeChanged$: Observable<Mode>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(MODE_STORAGE_SERVICE) private modeStorage: ModeStorage
  ) {
    this.modeChanged$ = this.modeChangedSubject.asObservable();
    this.updateCurrentMode(modeStorage.get());
    this.init();
  }

  /**
   * Function to mutate the currentMode
   * @param mode Mode
   */
  private updateCurrentMode(mode: Mode) {
    this.currentMode = mode;
    this.modeChangedSubject.next(this.currentMode);
    this.modeStorage.save(this.currentMode);
  }

  /**
   * Init function that update the application based on the initial mode value
   */
  private init() {
    this.document.body.classList.add(this.currentMode);
  }

  /**
   * Function that toggles the mode
   * Exposed publicly
   */
  toggleMode() {
    if (this.document.body.classList.contains(Mode.LIGHT)) {
      this.document.body.classList.remove(Mode.LIGHT);
      this.document.body.classList.add(Mode.DARK);
      this.updateCurrentMode(Mode.DARK);
    } else {
      this.document.body.classList.remove(Mode.DARK);
      this.document.body.classList.add(Mode.LIGHT);
      this.updateCurrentMode(Mode.LIGHT);
    }
  }
}