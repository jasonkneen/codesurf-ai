import { onCleanup } from "solid-js";
import { isServer, getRequestEvent } from "solid-js/web";
const HttpStatusCode = isServer ? (props) => {
  const event = getRequestEvent();
  event.response.status = props.code;
  event.response.statusText = props.text;
  onCleanup(() => !event.nativeEvent.handled && !event.complete && (event.response.status = 200));
  return null;
} : (_props) => null;
export {
  HttpStatusCode as H
};
