FROM ubuntu:18.04 AS build-base

# ARG VERSION="11.0.0"

# vonbrax/llvm         11.0.0              2ed08d6a7b30        41 hours ago        166MB

RUN echo "\n## Update and install dependencies" \
&& apt-get -qq update \
&& apt-get -qq install -y --no-install-recommends \
  ca-certificates \
  gnupg1 \
  binutils \
  build-essential \
  wget \
  python3 \
  git-core \
&& echo "\n## Download  and extract cmake 3.16.8" \
&& wget -q https://github.com/Kitware/CMake/releases/download/v3.16.8/cmake-3.16.8-Linux-x86_64.tar.gz \
&& tar -zxvf cmake-3.16.8-Linux-x86_64.tar.gz \
&& echo "\n## Clone LLVM repo (latest)" \
&& git clone --branch master --depth=1 https://github.com/llvm/llvm-project.git \
&& cd llvm-project \
&& mkdir -p build \
&& cd build \
&& echo "\n## Build LLVM" \
&& /cmake-3.16.8-Linux-x86_64/bin/cmake \
  -DLLVM_ENABLE_PROJECTS="lld;clang" \
  -DCMAKE_BUILD_TYPE=Release \
  -DLLVM_TARGETS_TO_BUILD="host;WebAssembly" \
  -DLLVM_INCLUDE_EXAMPLES=OFF \
  -DLLVM_INCLUDE_TESTS=OFF \
  ../llvm \
&& /cmake-3.16.8-Linux-x86_64/bin/cmake --build . --config Release \
&& echo "\n## Copy, strip and link binaries" \
&& cd bin \
&& mkdir /out \
&& cp clang-11 llc lld llvm-ar llvm-as llvm-nm /out \
&& cd /out \
&& find . -type f -perm -u=x -exec strip -s {} + || true \
&& ln -s clang-11 clang \
&& ln -s clang-11 clang++ \
&& ln -s clang-11 clang-cl \
&& ln -s clang-11 clang-cpp\
&& ln -s lld ld.lld \
&& ln -s lld ld64.lld \
&& ln -s lld lld-link \
&& ln -s lld wasm-ld \
&& ln -s llvm-ar llvm-dlltool \
&& ln -s llvm-ar llvm-lib \
&& ln -s llvm-ar llvm-ranlib \
&& echo "\n## Clean up" \
&& cd / \
&& rm cmake-3.16.8-Linux-x86_64.tar.gz \
&& rm -rf cmake-3.16.8-Linux-x86_64 \
&& rm -rf /llvm-project \
&& apt-get -qq purge -y \
  ca-certificates \
  gnupg1 \
  binutils \
  build-essential \
  wget \
  python3 \
  git-core \
&& apt-get -y clean \
&& apt-get -y autoclean \
&& apt-get -y autoremove \
&& rm -rf /var/lib/apt/lists/* \
&& rm -rf /var/cache/debconf/*-old \
&& rm -rf /usr/share/doc/* \
&& rm -rf /usr/share/man/?? \
&& rm -rf /usr/share/man/??_*

# ------------------------------------------------------------------------------

FROM scratch

COPY --from=build-base /out /llvm/bin

# ------------------------------------------------------------------------------
#     LLVM Binaries
#
#     614064 FileCheck
#   35245856 arcmt-test
#   45872912 bugpoint
#      13304 c-arcmt-test
#   34127000 c-index-test
#          8 clang -> clang-11
#          8 clang++ -> clang-11
#  104688520 clang-11
#   67763568 clang-check
#          8 clang-cl -> clang-11
#          8 clang-cpp -> clang-11
#   33273096 clang-diff
#   32713000 clang-extdef-mapping
#    2860320 clang-format
#   40867088 clang-import-test
#    4161712 clang-offload-bundler
#    2659920 clang-offload-wrapper
#   35190984 clang-refactor
#   33750048 clang-rename
#   32872168 clang-scan-deps
#    1810128 clang-tblgen
#      12568 count
#    7383872 diagtool
#   28327984 dsymutil
#       9974 hmaptool
#          3 ld.lld -> lld
#          3 ld64.lld -> lld
#   40353032 llc
#   54330736 lld
#          3 lld-link -> lld
#   36503688 lli
#     463408 lli-child-target
#      27672 llvm-PerfectShuffle
#         15 llvm-addr2line -> llvm-symbolizer
#    7849512 llvm-ar
#    3910512 llvm-as
#     494504 llvm-bcanalyzer
#   27455672 llvm-c-test
#    3505488 llvm-cat
#   11527744 llvm-cfi-verify
#     243032 llvm-config
#    5084280 llvm-cov
#    4161208 llvm-cvtres
#    4198720 llvm-cxxdump
#     501320 llvm-cxxfilt
#     572944 llvm-cxxmap
#    3263344 llvm-diff
#    2869016 llvm-dis
#          7 llvm-dlltool -> llvm-ar
#    7921272 llvm-dwarfdump
#   26942464 llvm-dwp
#    4180088 llvm-elfabi
#   28150088 llvm-exegesis
#    6123592 llvm-extract
#   25862224 llvm-gsymutil
#    2440232 llvm-ifs
#         12 llvm-install-name-tool -> llvm-objcopy
#   27220072 llvm-isel-fuzzer
#     551320 llvm-itanium-demangle-fuzzer
#   18484776 llvm-jitlink
#          7 llvm-lib -> llvm-ar
#    4599264 llvm-link
#    4169680 llvm-lipo
#        937 llvm-lit
#      14008 llvm-locstats
#   37012136 llvm-lto
#   46655360 llvm-lto2
#    6935624 llvm-mc
#    5037472 llvm-mca
#     510504 llvm-microsoft-demangle-fuzzer
#    6793176 llvm-ml
#    3649168 llvm-modextract
#     311656 llvm-mt
#    8227944 llvm-nm
#    5021912 llvm-objcopy
#   10515480 llvm-objdump
#   38415608 llvm-opt-fuzzer
#     749464 llvm-opt-report
#    7138696 llvm-pdbutil
#    2232256 llvm-profdata
#          7 llvm-ranlib -> llvm-ar
#     482624 llvm-rc
#         12 llvm-readelf -> llvm-readobj
#    6792200 llvm-readobj
#    3541640 llvm-reduce
#    6979784 llvm-rtdyld
#    4192912 llvm-size
#     423624 llvm-special-case-list-fuzzer
#    4302704 llvm-split
#    2295320 llvm-stress
#     350368 llvm-strings
#         12 llvm-strip -> llvm-objcopy
#    6110064 llvm-symbolizer
#    3849976 llvm-tblgen
#     452248 llvm-undname
#    6654552 llvm-xray
#     424440 llvm-yaml-numeric-parser-fuzzer
#     189168 not
#    6801576 obj2yaml
#   47811056 opt
#   10852560 sancov
#    6001360 sanstats
#      57935 scan-build
#       4702 scan-view
#    4249912 verify-uselistorder
#          3 wasm-ld -> lld
#     427928 yaml-bench
#    2324632 yaml2obj
