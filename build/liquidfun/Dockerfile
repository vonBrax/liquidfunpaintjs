FROM vonbrax/emscripten:1.39.12

COPY ./entry.sh /

RUN chmod +x /entry.sh \
&& apt-get -qq update && apt-get -qq install --no-install-recommends \
  ca-certificates \
  git-core \
&& echo "\n## Clone liquidfun" \
&& git clone -b feature/embind --depth 1 https://github.com/vonBrax/liquidfun.git /liquidfun \
&& echo "\n## Clean up liquidfun" \
&& cd /liquidfun \
&& rm -rf freeglut googletest Readme.md \
&& find ./liquidfun -mindepth 1 -maxdepth 1 -name Box2D -prune -o -exec rm -rf {} \; \
&& find ./liquidfun/Box2D -mindepth 1 -maxdepth 1 -name Box2D -prune -o -name lfjs -prune -o -exec rm -rf {} \;

VOLUME /src

ENTRYPOINT [ "/entry.sh" ]
