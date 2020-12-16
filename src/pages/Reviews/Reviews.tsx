import cn from 'classnames';
import { observable, action, reaction, IReactionDisposer } from 'mobx';
import ReactMarkdown from 'react-markdown';
import Scrollbar from 'react-scrollbars-custom';

import { Header } from 'components/Header';
import { ConnectedComponent } from 'components/ConnectedComponent';
import { images } from 'assets/images';
import { Footer } from 'components/Footer';
import { getElementChildren, getElementVerticalPaddings, sumElementsHeights } from 'utils';

import styles from './Reviews.scss';
import { messages } from './messages';

const minScrollAreaHeight = 100;

@ConnectedComponent.observer
class Reviews extends ConnectedComponent {
  state = observable({
    // Server does not have screen size, have to use a constant for correct hydration
    scrollAreaHeight: minScrollAreaHeight,
    leftImageWidth: 0,
  });
  wrapperElement: HTMLElement;
  leftImageElement: HTMLElement;
  screenResizeDisposer: IReactionDisposer;

  UNSAFE_componentWillMount() {
    const { actions } = this.context;

    actions.general.setMetaData({
      title: messages.metaTitle,
      description: messages.metaDescription,
    });
  }

  componentDidMount() {
    const { store } = this.context;

    this.onScreenResize();
    this.screenResizeDisposer = reaction(
      () => [store.ui.screen.height, store.ui.screen.width],
      this.onScreenResize
    );
  }

  componentWillUnmount() {
    this.screenResizeDisposer();
  }

  @action
  onScreenResize = () => {
    const { store } = this.context;

    if (!store.ui.firstRendered) return setTimeout(this.onScreenResize, 5);

    this.state.scrollAreaHeight = this.scrollAreaHeight;

    if (this.leftImageElement) {
      this.state.leftImageWidth = this.leftImageElement.offsetWidth;

      // Try until image is loaded
      if (this.state.leftImageWidth === 0) {
        setTimeout(this.onScreenResize, 5);
      }
    }
  };

  get scrollAreaHeight() {
    /**
     * Scroll area must use all available height
     *
     */

    const { store } = this.context;

    const wrapperVerticalPaddings = getElementVerticalPaddings({ element: this.wrapperElement });
    const childrenExceptScrollArea = getElementChildren({
      element: this.wrapperElement,
      exclude: el => !el.className.includes('ScrollbarsCustom'),
    });
    const usedVerticalSpace =
      sumElementsHeights({ elements: childrenExceptScrollArea }) +
      wrapperVerticalPaddings +
      store.ui.heights.header;
    const scrollAreaHeight = store.ui.screen.height - usedVerticalSpace;

    return Math.max(scrollAreaHeight, minScrollAreaHeight);
  }

  get wrapperClassName() {
    const { store } = this.context;
    const { leftImageWidth } = this.state;

    return cn({
      [styles.wrapper]: true,
      [styles.isMobile]: store.ui.isMobile,
      [styles.invisible]: !store.ui.isMobile && leftImageWidth === 0,
    });
  }

  render() {
    const { store } = this.context;
    const { scrollAreaHeight, leftImageWidth } = this.state;

    return (
      <>
        <Header />
        {!store.ui.isMobile && store.ui.firstRendered && (
          <img
            className={styles.leftImage}
            src={images.pageReviewsBg}
            ref={node => (this.leftImageElement = node)}
          />
        )}
        <div
          className={this.wrapperClassName}
          ref={node => (this.wrapperElement = node)}
          style={{ paddingLeft: leftImageWidth + 60 }}
        >
          <div className={styles.title}>{store.getLn(messages.title)}</div>
          {store.ui.isMobile ? (
            <ReactMarkdown className={styles.text} source={store.getLn(messages.reviews)} />
          ) : (
            <Scrollbar
              style={{ height: scrollAreaHeight }}
              minimalThumbSize={14}
              maximalThumbSize={14}
            >
              <ReactMarkdown className={styles.text} source={store.getLn(messages.reviews)} />
            </Scrollbar>
          )}

          {!store.ui.isMobile && <Footer className={styles.footer} />}
        </div>
      </>
    );
  }
}

export default {
  Component: Reviews,
};
