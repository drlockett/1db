class OneDb < Formula
  desc "CLI for the 1db.io programmable edge API"
  homepage "https://1db.io"
  url "https://github.com/drlockett/1db/archive/refs/tags/v0.1.0.tar.gz"
  sha256 "REPLACE_WITH_RELEASE_SHA256"
  license "MIT"

  depends_on "node"

  def install
    bin.install "cli/1db"
  end

  test do
    assert_match "1db CLI", shell_output("#{bin}/1db --help")
  end
end
