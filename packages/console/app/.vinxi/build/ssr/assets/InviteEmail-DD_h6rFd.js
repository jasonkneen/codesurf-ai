import { createComponent, mergeProps } from "solid-js/web";
import React from "react";
import { Font, Text as Text$1, Html, Head, Preview, Body, Container, Section, Row, Column, Img, Button, Link } from "@jsx-email/all";
const unit = 12;
const PRIMARY_COLOR = "#211E1E";
const TEXT_COLOR = "#656363";
const LINK_COLOR = "#007AFF";
const LINK_BACKGROUND_COLOR = "#F9F8F8";
const BACKGROUND_COLOR = "#F0F0F1";
const SURFACE_DIVIDER_COLOR = "#D5D5D9";
const body = {
  background: BACKGROUND_COLOR
};
const container = {
  minWidth: "600px",
  padding: "64px 0px"
};
const frame = {
  padding: `${unit * 2}px`,
  border: `1px solid ${SURFACE_DIVIDER_COLOR}`,
  background: "#FFF",
  borderRadius: "6px",
  boxShadow: `0 1px 2px rgba(0,0,0,0.03),
              0 2px 4px rgba(0,0,0,0.03),
              0 2px 6px rgba(0,0,0,0.03)`
};
const baseText = {
  fontFamily: "JetBrains Mono, monospace"
};
const headingText = {
  color: PRIMARY_COLOR,
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "normal"
};
const contentText = {
  color: TEXT_COLOR,
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "180%"
};
const buttonText = {
  color: "#FDFCFC",
  fontSize: "16px",
  fontWeight: 500,
  margin: 0,
  padding: 0,
  display: "inline-flex",
  alignItems: "center",
  gap: "12px"
};
const linkText = {
  color: LINK_COLOR,
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "150%",
  textDecorationLine: "underline",
  textDecorationStyle: "solid",
  textDecorationSkipInk: "auto",
  textDecorationThickness: "auto",
  textUnderlineOffset: "auto",
  textUnderlinePosition: "from-font",
  borderRadius: "4px",
  background: LINK_BACKGROUND_COLOR,
  padding: "8px 12px",
  textAlign: "center"
};
const contentHighlightText = {
  color: PRIMARY_COLOR
};
const button = {
  display: "inline-grid",
  padding: "8px 12px 8px 20px",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  flexShrink: "0",
  borderRadius: "4px",
  backgroundColor: PRIMARY_COLOR
};
function Text(props) {
  return createComponent(Text$1, mergeProps(props, {
    get style() {
      return {
        ...baseText,
        ...props.style
      };
    }
  }));
}
function Title({
  children
}) {
  return React.createElement("title", null, children);
}
function A({
  children,
  ...props
}) {
  return React.createElement("a", props, children);
}
function Span({
  children,
  ...props
}) {
  return React.createElement("span", props, children);
}
function Fonts({
  assetsUrl
}) {
  return [createComponent(Font, {
    fontFamily: "JetBrains Mono",
    fallbackFontFamily: "monospace",
    webFont: {
      url: `${assetsUrl}/JetBrainsMono-Regular.woff2`,
      format: "woff2"
    },
    fontWeight: "400",
    fontStyle: "normal"
  }), createComponent(Font, {
    fontFamily: "JetBrains Mono",
    fallbackFontFamily: "monospace",
    webFont: {
      url: `${assetsUrl}/JetBrainsMono-Medium.woff2`,
      format: "woff2"
    },
    fontWeight: "500",
    fontStyle: "normal"
  }), createComponent(Font, {
    fontFamily: "Rubik",
    fallbackFontFamily: ["Helvetica", "Arial", "sans-serif"],
    webFont: {
      url: `${assetsUrl}/rubik-latin.woff2`,
      format: "woff2"
    },
    fontWeight: "400 500 600 700",
    fontStyle: "normal"
  })];
}
const CONSOLE_URL = "https://opencode.ai/";
const InviteEmail = ({
  inviter = "test@anoma.ly",
  workspaceID = "wrk_01K6XFY7V53T8XN0A7X8G9BTN3",
  workspaceName = "anomaly",
  assetsUrl = `${CONSOLE_URL}email`
}) => {
  const messagePlain = `${inviter} invited you to join the ${workspaceName} workspace.`;
  const url = `${CONSOLE_URL}workspace/${workspaceID}`;
  return createComponent(Html, {
    lang: "en",
    get children() {
      return [createComponent(Head, {
        get children() {
          return createComponent(Title, {
            children: `OpenCode — ${messagePlain}`
          });
        }
      }), createComponent(Fonts, {
        assetsUrl
      }), createComponent(Preview, {
        children: messagePlain
      }), createComponent(Body, {
        style: body,
        get id() {
          return Math.random().toString();
        },
        get children() {
          return createComponent(Container, {
            style: container,
            get children() {
              return createComponent(Section, {
                style: frame,
                get children() {
                  return [createComponent(Row, {
                    get children() {
                      return createComponent(Column, {
                        get children() {
                          return createComponent(A, {
                            href: `${CONSOLE_URL}zen`,
                            get children() {
                              return createComponent(Img, {
                                height: "32",
                                alt: "OpenCode Logo",
                                src: `${assetsUrl}/logo.png`
                              });
                            }
                          });
                        }
                      });
                    }
                  }), createComponent(Section, {
                    style: {
                      padding: `${unit * 2}px 0 0 0`
                    },
                    get children() {
                      return [createComponent(Text, {
                        style: headingText,
                        children: "Join your team's OpenCode workspace"
                      }), createComponent(Text, {
                        style: contentText,
                        get children() {
                          return ["You have been invited by ", createComponent(Span, {
                            style: contentHighlightText,
                            children: inviter
                          }), " to join the", " ", createComponent(Span, {
                            style: contentHighlightText,
                            children: workspaceName
                          }), " workspace on OpenCode."];
                        }
                      })];
                    }
                  }), createComponent(Section, {
                    style: {
                      padding: `${unit}px 0 0 0`
                    },
                    get children() {
                      return createComponent(Button, {
                        style: button,
                        href: url,
                        get children() {
                          return createComponent(Text, {
                            style: buttonText,
                            get children() {
                              return ["Join workspace", createComponent(Img, {
                                width: "24",
                                height: "24",
                                src: `${assetsUrl}/right-arrow.png`,
                                alt: "Arrow right"
                              })];
                            }
                          });
                        }
                      });
                    }
                  }), createComponent(Section, {
                    style: {
                      padding: `${unit}px 0 0 0`
                    },
                    get children() {
                      return [createComponent(Text, {
                        style: contentText,
                        children: "Button not working? Copy the following link..."
                      }), createComponent(Link, {
                        href: url,
                        get children() {
                          return createComponent(Text, {
                            style: linkText,
                            children: url
                          });
                        }
                      })];
                    }
                  })];
                }
              });
            }
          });
        }
      })];
    }
  });
};
export {
  InviteEmail,
  InviteEmail as default
};
