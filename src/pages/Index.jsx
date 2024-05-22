import React, { useState } from "react";
import { Container, Input, Button, VStack, Text, Box, Image, HStack } from "@chakra-ui/react";
import { FaSearch, FaHeart } from "react-icons/fa";
import html2canvas from "html2canvas";

const Index = () => {
  const [userId, setUserId] = useState("");
  const [data, setData] = useState({ text: "", strongText: "", smallText: "", footerText: "", imgSrc: "" });
  const [loading, setLoading] = useState(false);
  const [fetchButtonVisible, setFetchButtonVisible] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    setFetchButtonVisible(false);
    try {
      const response = await fetch(`https://tirsik.net/index.php?peyam=${userId}`);
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");
      const strongText = doc.querySelector("div strong")?.textContent || "";
      const smallText = doc.querySelector("button.btn-xs span")?.textContent || "";
      const footerText = doc.querySelector("font a")?.textContent || "";
      const imgSrc = doc.querySelector("img.img-circle")?.getAttribute("src") || "";

      let dataText =
        Array.from(doc.querySelectorAll("div.datagrid p"))
          .map((p) => {
            let clone = p.cloneNode(true);
            clone.querySelectorAll("strong").forEach((strong) => strong.remove());
            return clone.textContent;
          })
          .join("") || "Tiştek Tune ye.";

      if (dataText.length > 450) {
        const index = dataText.indexOf(". ", 450);
        if (index !== -1) {
          dataText = dataText.substring(0, index + 1) + "..";
        }
      }

      setData({ text: dataText, strongText, smallText, footerText, imgSrc });
    } catch (error) {
      setData({ text: "Xeletî Derket", strongText: "", smallText: "", footerText: "", imgSrc: "" });
    }
    setLoading(false);
  };

  const downloadImage = async () => {
    const element = document.getElementById("capture");
    const canvas = await html2canvas(element, { useCORS: true, scale: 2 }); // Increase scale for better quality
    const data = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = data;
    link.download = "tirsik.png";
    link.click();
  };

  const handleNewButtonClick = () => {
    setData({ text: "", strongText: "", smallText: "", footerText: "", imgSrc: "" });
    setUserId("");
    setFetchButtonVisible(true);
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Wenêya Peyaman</Text>
        {fetchButtonVisible && (
          <>
            <Input placeholder="ID-ya peyamê binivîsîne" value={userId} onChange={(e) => setUserId(e.target.value)} />
            <Button leftIcon={<FaSearch />} colorScheme="purple" onClick={fetchData} isLoading={loading}>
              Bîne
            </Button>
          </>
        )}
        {data.text && (
          <>
            <Box
              id="capture"
              position="relative"
              top="0px"
              width="800px"
              height="600px"
              backgroundColor="white"
              textAlign="center"
              border="1px solid #ccc"
              p={4}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Text
                color="purple"
                fontWeight="bold"
                maxWidth="90%"
                fontSize="45px"
                overflowWrap="break-word"
                wordWrap="break-word"
                style={{ marginBottom: "20px" }}
              >
                {data.strongText}
              </Text>

              <Text
                color="black"
                fontSize="2xl"
                fontWeight="bold"
                maxWidth="90%"
                overflowWrap="break-word"
                wordWrap="break-word"
                style={{ lineHeight: "1.8", marginBottom: "20px", maxHeight: "70%" }}
              >
                {data.text}
              </Text>

              <Image src="../aubergine.jpg" alt="Logo" style={{ position: "absolute", top: "20px", right: "10px", width: "50px" }} />
              <Box position="absolute" bottom="10px" left="10px" display="flex" alignItems="center">
                <FaHeart color="red" size="30" />
                {data.smallText && (
                  <Text color="black" fontSize="md" fontWeight="bold" ml={2}>
                    {data.smallText}
                  </Text>
                )}
              </Box>

              {data.footerText && (
                <Text position="absolute" bottom="10px" right="10px" color="black" fontSize="md" fontWeight="bold">
                  {data.footerText}
                </Text>
              )}
              {data.imgSrc && (
                <Image src={`https://tirsik.net/${data.imgSrc}`} alt="Circle" position="absolute" bottom="35px" right="10px" borderRadius="full" boxSize="50px" />
              )}


            </Box>
            <HStack spacing={4} marginBottom="20px">
              <Button colorScheme="teal" onClick={downloadImage}>
                Daxe
              </Button>
              <Button colorScheme="teal" onClick={handleNewButtonClick}>
                Yekê nû
              </Button>
            </HStack>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
