class OneDb < Formula
  desc "CLI for the 1db.io programmable edge API"
  homepage "https://1db.io"
  url "file:///Users/nr-admin/1db.io/dist/1db-0.1.0.tar.gz"
  sha256 "b185a17462a3888787e3182d0e83884e4ede4483fe9f50c46dd147c45d16c86a"
  license "MIT"

  depends_on "node"

  def install
    bin.install "cli/1db" => "1db"
  end

  test do
    assert_match "1db CLI", shell_output("#{bin}/1db --help")
  end
end
