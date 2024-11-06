{
  description = "OsmAPP development enviroment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = {
    self,
    nixpkgs,
  }: let
    supportedSystems = ["x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin"];
    forEachSupportedSystem = f:
      nixpkgs.lib.genAttrs supportedSystems (system:
        f {
          pkgs = import nixpkgs {
            inherit system;
            overlays = [self.overlays.default];
          };
        });
  in {
    overlays.default = final: prev: rec {
      nodejs = prev.nodejs_20;
      yarn = prev.yarn.override {inherit nodejs;};
    };

    devShells = forEachSupportedSystem ({pkgs}: {
      default = pkgs.mkShell {
        packages = with pkgs; [
          nodejs
          yarn
          nodePackages.typescript-language-server
          prettierd

          libuuid # For jest
        ];
        shellHook = ''
          if [ ! -d node_modules ]; then
            echo "Use yarn to install dependencies"
          fi
        '';
        env = {LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [pkgs.libuuid];};
      };
    });
  };
}
