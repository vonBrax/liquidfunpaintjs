# FROM vonbrax/emscripten:1.39.18
FROM emscripten/emsdk:2.0.11

COPY ./entry.sh /

RUN apt-get -qq update && apt-get -qq install --no-install-recommends \
  ca-certificates \
  git-core \
&& echo "\n## Create the .emscripten file" \
&& emcc -v \
&& emcc -v \
&& echo "\n## Test emcc and pre-populate cache" \
&& mkdir /test-emcc \
&& cd /test-emcc \
&& printf '#include <iostream>\nint main(){std::cout << "HELLO FROM DOCKER C++"<<std::endl;return 0;}' > test.cpp \
&& emcc test.cpp && node a.out.js \
# # Embind
&& echo "\n## Test embind" \
&& printf "#include <string>\n#include <emscripten/bind.h>\nint main() {\n    std::string str = \"Hello, world\";\n    auto temp = emscripten::val(str);\n}\n" > test.cpp \
&& emcc test.cpp -o test.js -s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=1 -s PROXY_TO_PTHREAD=1 --bind -std=c++11 \
&& emcc test.cpp -o test.js --bind -std=c++11 \
# && rm test.cpp *.js *.wasm \
&& cd \
&& rm -rf test-emcc \
# sleep will make sure that created cache will be stored correctly
&& sleep 2 \
&& echo "\n## Clone liquidfun" \
&& git clone -b feature/embind --depth 1 https://github.com/vonBrax/liquidfun.git /liquidfun \
&& echo "\n## Clean up liquidfun" \
&& cd /liquidfun \
&& rm -rf freeglut googletest Readme.md \
&& find ./liquidfun -mindepth 1 -maxdepth 1 -name Box2D -prune -o -exec rm -rf {} \; \
&& find ./liquidfun/Box2D -mindepth 1 -maxdepth 1 -name Box2D -prune -o -name lfjs -prune -o -exec rm -rf {} \; \
&& chmod +x /entry.sh

VOLUME /src

ENTRYPOINT [ "/entry.sh" ]
